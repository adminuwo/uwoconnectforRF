'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LifeBuoy, Send, Loader2, User, Search, Filter, CheckCheck, ArrowLeft } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import axios from 'axios';
import { cn } from '@/lib/utils';

const AdminSupportPage = () => {
  const [clients, setClients] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const scrollRef = useRef(null);

  // Fetch all unique clients who have started support chats
  const fetchClients = async (silent = false) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/support/messages/clients/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClients(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      if (res.data.length > 0 && !selectedClientId && !silent) {
        setSelectedClientId(res.data[0].id);
      }
    } catch (err) {
      console.warn('Failed to fetch support clients list');
    } finally {
      setLoadingList(false);
    }
  };

  // Fetch messages for active client
  const fetchMessages = async () => {
    if (!selectedClientId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/support/messages/?client_id=${selectedClientId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.warn('Failed to fetch support messages for client:', selectedClientId);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    fetchClients();
    const interval = setInterval(() => {
      fetchClients(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedClientId) {
      setLoadingChat(true);
      fetchMessages();
    }
  }, [selectedClientId]);

  // Periodic poll for active chat messages
  useEffect(() => {
    let interval;
    if (selectedClientId) {
      interval = setInterval(fetchMessages, 4000);
    }
    return () => clearInterval(interval);
  }, [selectedClientId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!replyText.trim() || !selectedClientId || isSending) return;
    const textToSend = replyText.trim();
    setReplyText('');
    setIsSending(true);

    // Optimistic UI update
    const tempMessage = {
      id: `temp_${Date.now()}`,
      body: textToSend,
      sender_role: 'ADMIN',
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/support/messages/`, {
        body: textToSend,
        client_id: selectedClientId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages();
      fetchClients(true);
    } catch (err) {
      console.warn('Failed to send support reply');
      alert('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const activeClient = clients.find(c => c.id === selectedClientId);
  const filteredClients = clients.filter(c => c.business_name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <DashboardLayout role="ADMIN">
      <div className="h-[calc(100vh-140px)] md:h-[calc(100vh-180px)] flex flex-col">
        {/* Header */}
        <div className="mb-3 md:mb-6 flex items-center justify-between px-2 shrink-0">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <LifeBuoy className="text-[#059669]" size={24} /> Help Desk Control Room
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 hidden sm:block">Reply to support requests from your clients</p>
          </div>
        </div>

        {/* Workspace layout */}
        <div className="flex-1 flex bg-white rounded-2xl md:rounded-[40px] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden">
          
          {/* Sidebar Clients List */}
          <aside className={cn("w-full md:w-80 border-r border-slate-50 flex flex-col bg-white shrink-0", mobileShowChat ? "hidden md:flex" : "flex")}>
            <div className="p-3 md:p-6 border-b border-slate-50 bg-slate-50/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" placeholder="Search clients..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium text-slate-700"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loadingList && clients.length === 0 ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-200" /></div>
              ) : filteredClients.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No support tickets</p>
                </div>
              ) : filteredClients.map((c) => (
                <button 
                  key={c.id} 
                  onClick={() => { setSelectedClientId(c.id); setMobileShowChat(true); }}
                  className={cn(
                    "w-full p-6 text-left border-b border-slate-50 transition-all flex gap-4 hover:bg-slate-50/50",
                    selectedClientId === c.id ? "bg-emerald-50/50 border-r-4 border-r-emerald-500" : ""
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                      {c.business_name[0].toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-bold text-slate-900 truncate">{c.business_name}</p>
                      {c.last_message_time && (
                        <p className="text-[9px] font-bold text-slate-300">
                          {new Date(c.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400 truncate leading-relaxed">
                      {c.last_message_body}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Active Chat Feed */}
          <main className={cn("flex-1 flex flex-col bg-white min-w-0", mobileShowChat ? "flex" : "hidden md:flex")}>
            {activeClient ? (
              <>
                {/* Header */}
                <header className="h-16 border-b border-slate-50 flex items-center justify-between px-4 sm:px-8 bg-white shrink-0">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => setMobileShowChat(false)} className="md:hidden p-1.5 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                      <ArrowLeft size={20} />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#059669] flex items-center justify-center font-bold text-sm">
                      {activeClient.business_name[0].toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-xs font-bold text-slate-900">{activeClient.business_name}</h2>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Active Ticket</p>
                    </div>
                  </div>
                </header>

                {/* Messages Panel */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 bg-slate-50/10 custom-scrollbar" ref={scrollRef}>
                  {loadingChat ? (
                    <div className="h-full flex items-center justify-center">
                      <Loader2 className="animate-spin text-[#059669]" />
                    </div>
                  ) : (
                    messages.map((msg, i) => {
                      const isClient = msg.sender_role === 'CLIENT';
                      return (
                        <div key={msg.id || i} className={cn("flex flex-col", isClient ? "items-start" : "items-end")}>
                          <div className={cn(
                            "max-w-[85%] md:max-w-[75%] p-3 sm:p-4 rounded-[20px] sm:rounded-[24px] text-sm leading-relaxed shadow-sm transition-all hover:shadow-md",
                            isClient 
                              ? "bg-slate-100 text-slate-700 rounded-bl-none" 
                              : "bg-[#059669] text-white rounded-br-none"
                          )}>
                            {msg.body}
                          </div>
                          <div className="mt-1 flex items-center gap-1.5 px-2">
                            <span className="text-[9px] font-bold text-slate-300 uppercase">
                              {isClient ? activeClient.business_name : 'Support (You)'} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {!isClient && <CheckCheck size={10} className="text-[#059669]" />}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Chat Input */}
                <div className="p-3 sm:p-6 border-t border-slate-50 bg-white shrink-0">
                  <div className="bg-slate-50 rounded-[28px] p-2 flex items-center border border-slate-100 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all shadow-inner">
                    <textarea 
                      rows={1}
                      placeholder="Type a support reply..."
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
                          ? "bg-[#059669] hover:bg-slate-900 shadow-emerald-100" 
                          : "bg-slate-300 cursor-not-allowed shadow-none"
                      )}
                    >
                      {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-60">
                <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
                  <LifeBuoy size={28} />
                </div>
                <h3 className="text-sm font-bold text-slate-700 mb-1">Control Room Empty</h3>
                <p className="text-xs text-slate-400 max-w-xs font-semibold">Select a client support ticket from the sidebar to view thread.</p>
              </div>
            )}
          </main>
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

export default AdminSupportPage;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Search, Loader2, User, Phone, Mail, 
  MapPin, Send, Plus, MoreHorizontal, Filter, 
  Smile, Paperclip, Zap, ArrowLeft, Check, CheckCheck, Archive, Sparkles, Lock,
  FileText, Download, Image as ImageIcon, Music, Film, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
const ClientInboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedConvoId, setSelectedConvoId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [isInternal, setIsInternal] = useState(false);
  const [isDrafting, setIsDrafting] = useState(false);
  const [isSyncingGmail, setIsSyncingGmail] = useState(false);
  const scrollRef = useRef(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const [msgRes, contactRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/messages/`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/contacts/`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setMessages(msgRes.data);
      setContacts(contactRes.data);
      if (msgRes.data.length > 0 && !selectedConvoId) {
        const firstSender = [...new Set(msgRes.data.map(m => m.from_address))][0];
        setSelectedConvoId(firstSender);
      }
    } catch (err) {
      console.warn('Failed to fetch messages and contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-poll every 3 seconds so new messages load live without page refresh
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, [selectedConvoId]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    let wsUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
    wsUrl = wsUrl.replace(/^http/, 'ws') + `/ws/inbox/?token=${token}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'new_message') {
          setMessages(prev => {
            // Avoid duplicates
            if (prev.some(m => m.id === data.message.id)) return prev;
            return [...prev, data.message];
          });
        }
      } catch (err) {
        console.error('Failed to parse WebSocket message:', err);
      }
    };

    ws.onerror = (err) => {
      console.warn('WebSocket error:', err);
    };

    return () => {
      ws.close();
    };
  }, []);

  const activeContact = contacts.find(
    c => c.platform_id === selectedConvoId || c.phone_number === selectedConvoId
  );

  const handleToggleBot = async (contact) => {
    if (!contact) return;
    const targetState = !contact.bot_paused;
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/contacts/${contact.id}/`, 
        { bot_paused: targetState }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, bot_paused: targetState } : c));
    } catch (err) {
      console.warn('Failed to toggle bot:', err);
      alert('Failed to toggle bot');
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedConvoId, messages]);

  // Normalize phone numbers to prevent +91... and 91... splitting into separate conversations
  const normalizeContactId = (rawId) => {
    if (!rawId) return 'Unknown';
    const digits = rawId.replace(/[^0-9]/g, '');
    return digits || rawId;
  };

  // Group messages by contact to create "Conversations"
  const conversations = messages.reduce((acc, msg) => {
    const rawContact = msg.message_type === 'INCOMING' ? msg.from_address : msg.to_address;
    const contactKey = normalizeContactId(rawContact);
    
    if (!acc[contactKey]) {
      acc[contactKey] = {
        id: contactKey,
        name: rawContact.startsWith('+') ? rawContact : `+${rawContact}`,
        rawAddress: rawContact,
        lastMessage: msg.body || '📎 [Media Attachment]',
        time: msg.created_at,
        unread: msg.message_type === 'INCOMING' ? 1 : 0,
        channel: msg.channel || 'WHATSAPP',
        messages: []
      };
    }
    acc[contactKey].messages.push(msg);
    // Sort messages within convo chronologically
    acc[contactKey].messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    // Update last message
    if (new Date(msg.created_at) > new Date(acc[contactKey].time)) {
      acc[contactKey].lastMessage = msg.body || '📎 [Media Attachment]';
      acc[contactKey].time = msg.created_at;
      acc[contactKey].channel = msg.channel || 'WHATSAPP';
    }
    return acc;
  }, {});

  const convoList = Object.values(conversations)
    .filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(c => activeFilter === 'ALL' || c.channel === activeFilter)
    .sort((a, b) => new Date(b.time) - new Date(a.time));

  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    const newList = Object.values(conversations)
      .filter(c => c.id.toLowerCase().includes(searchTerm.toLowerCase()))
      .filter(c => newFilter === 'ALL' || c.channel === newFilter)
      .sort((a, b) => new Date(b.time) - new Date(a.time));
    if (selectedConvoId && !newList.some(c => c.id === selectedConvoId)) {
      setSelectedConvoId(newList.length > 0 ? newList[0].id : null);
    }
  };

  const activeConvo = convoList.find(c => c.id === selectedConvoId) || null;

  const handleSendMessage = async () => {
    if (!replyText.trim() || !activeConvo || isSending) return;
    
    const textToSend = replyText.trim();
    setReplyText(''); // Clear input
    setIsSending(true);

    const nowTs = Date.now();
    const optimisticMsg = {
      id: `temp_${nowTs}`,
      from_address: 'SYSTEM',
      to_address: activeConvo.id,
      body: textToSend,
      channel: activeConvo.channel,
      message_type: isInternal ? 'INTERNAL' : 'OUTGOING',
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, optimisticMsg]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/messages/`, {
        to_number: activeConvo.id,
        body: textToSend,
        channel: activeConvo.channel,
        message_type: isInternal ? 'INTERNAL' : 'OUTGOING'
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      fetchData();
      if (isInternal) {
        setIsInternal(false);
      }
    } catch (err) {
      console.warn('Failed to send message:', err);
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const handleSuggestDraft = async () => {
    if (!activeContact) return;
    setIsDrafting(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/messages/suggest_draft/`, {
        contact_id: activeContact.id
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setReplyText(res.data.draft || '');
    } catch (err) {
      console.warn('Failed to get draft:', err);
      alert("Failed to generate draft");
    } finally {
      setIsDrafting(false);
    }
  };

  const handleArchive = async () => {
    if (!activeContact) return;
    try {
      const token = localStorage.getItem('token');
      const newState = !activeContact.is_archived;
      await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/contacts/${activeContact.id}/`, {
        is_archived: newState
      }, { headers: { Authorization: `Bearer ${token}` } });
      
      setContacts(prev => prev.map(c => c.id === activeContact.id ? { ...c, is_archived: newState } : c));
    } catch (err) {
      console.warn('Failed to archive contact:', err);
      alert("Failed to archive");
    }
  };

  const handleSyncGmail = async () => {
    setIsSyncingGmail(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/gmail/sync`, {}, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (res.data.synced_count > 0) {
        const msgRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/messages/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(msgRes.data);
        alert(`Successfully synced ${res.data.synced_count} new messages!`);
      } else {
        alert("No new messages found.");
      }
    } catch (err) {
      console.warn('Failed to sync gmail:', err);
      alert("Failed to sync Gmail. Make sure it's connected.");
    } finally {
      setIsSyncingGmail(false);
    }
  };


  return (
    <DashboardLayout role="CLIENT">
      <div className="h-full flex flex-col min-h-0">
        {/* Page Header */}
        <div className="mb-2 flex items-center justify-between px-1 shrink-0">
          <div>
            <h1 className="text-base md:text-xl font-black text-slate-900 tracking-tight">Inbox</h1>
            <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest hidden sm:block">Real-time Customer Support</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2 hidden sm:flex">
              {[1,2,3].map(i => (
                <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                  <User size={12} className="text-slate-400" />
                </div>
              ))}
            </div>
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">+12 agents online</span>
          </div>
        </div>

        {/* Intercom Style Main Container */}
        <div className="flex-1 flex bg-white rounded-2xl md:rounded-[32px] border border-slate-100 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] overflow-hidden min-h-0">
          
          {/* Column 1: Conversation List */}
          <aside className={cn("w-full md:w-80 lg:w-96 border-r border-slate-50 flex flex-col bg-white md:shrink-0", mobileShowChat ? "hidden md:flex" : "flex")}>
            <div className="p-3 md:p-6 border-b border-slate-50 bg-slate-50/30">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                <input 
                  type="text" placeholder="Search conversations..." 
                  value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
              </div>
              <div className="flex items-center gap-1.5 mt-4 overflow-x-auto pb-1 custom-scrollbar">
                <button 
                  onClick={() => handleFilterChange('ALL')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeFilter === 'ALL' ? "bg-slate-900 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  All
                </button>
                <button 
                  onClick={() => handleFilterChange('WHATSAPP')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeFilter === 'WHATSAPP' ? "bg-emerald-600 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  WhatsApp
                </button>
                <button 
                  onClick={() => handleFilterChange('INSTAGRAM')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeFilter === 'INSTAGRAM' ? "bg-pink-500 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  Instagram
                </button>
                <button 
                  onClick={() => handleFilterChange('FACEBOOK')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
                    activeFilter === 'FACEBOOK' ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  Facebook
                </button>
                <button 
                  onClick={() => handleFilterChange('GMAIL')}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex-shrink-0",
                    activeFilter === 'GMAIL' ? "bg-red-500 text-white" : "text-slate-400 hover:bg-slate-100"
                  )}
                >
                  Gmail
                </button>
              </div>
              
              {activeFilter === 'GMAIL' && (
                <div className="mt-3">
                  <button
                    onClick={handleSyncGmail}
                    disabled={isSyncingGmail}
                    className="w-full py-2 bg-red-50 text-red-600 rounded-xl text-xs font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSyncingGmail ? <Loader2 size={14} className="animate-spin" /> : <Loader2 size={14} className="rotate-180" />}
                    {isSyncingGmail ? 'Syncing...' : 'Sync Incoming Emails'}
                  </button>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-slate-200" /></div>
              ) : convoList.length === 0 ? (
                <div className="p-10 text-center">
                  <p className="text-xs text-slate-300 font-bold uppercase tracking-widest">No conversations</p>
                </div>
              ) : convoList.filter(c => {
                const cContact = contacts.find(cont => cont.platform_id === c.id || cont.phone_number === c.id);
                // Don't show archived by default unless searched
                if (cContact?.is_archived && !searchTerm) return false;
                return true;
              }).map((convo) => (
                <button 
                  key={convo.id} 
                  onClick={() => { setSelectedConvoId(convo.id); setMobileShowChat(true); }}
                  className={cn(
                    "w-[94%] mx-[3%] my-1 p-3 text-left rounded-xl transition-all flex gap-3 cursor-pointer hover:bg-slate-50",
                    selectedConvoId === convo.id ? "bg-emerald-50 text-slate-900 border border-emerald-100" : "bg-transparent text-slate-700"
                  )}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-xl bg-slate-100/80 flex items-center justify-center text-slate-600 font-bold text-sm">
                      {convo.name[0].toUpperCase()}
                    </div>
                    <div className={cn(
                        "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center text-[7px] text-white font-black",
                        convo.channel === 'FACEBOOK' ? "bg-blue-600" :
                        convo.channel === 'INSTAGRAM' ? "bg-pink-500" : "bg-emerald-500"
                      )}>
                        {convo.channel === 'FACEBOOK' ? 'F' : convo.channel === 'INSTAGRAM' ? 'I' : 'W'}
                      </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold text-slate-800 truncate">{convo.name}</p>
                      <p className="text-[9px] font-semibold text-slate-400">
                        {new Date(convo.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <p className="text-[11px] text-slate-400 truncate leading-relaxed mt-0.5">
                      {convo.lastMessage}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Column 2: Active Chat Area */}
          <main className={cn("flex-1 flex flex-col bg-white min-w-0", mobileShowChat ? "flex" : "hidden md:flex")}>
            {activeConvo ? (
              <>
                {/* Chat Header */}
                <header className="h-14 border-b border-slate-100 flex items-center justify-between px-4 md:px-6 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <div className="flex items-center gap-2 md:gap-3">
                    <button onClick={() => setMobileShowChat(false)} className="md:hidden p-1 text-slate-400 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs">
                      {activeConvo.name[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-slate-900">{activeConvo.name}</h2>
                        <span className={cn(
                          "text-[8px] font-black px-1.5 py-0.5 rounded-md text-white uppercase tracking-wider",
                          activeConvo.channel === 'FACEBOOK' ? "bg-blue-600" :
                          activeConvo.channel === 'INSTAGRAM' ? "bg-pink-500" : "bg-emerald-600"
                        )}>
                          {activeConvo.channel}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Online</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400">
                    <button className="hover:text-slate-900 transition-colors"><Zap size={18} /></button>
                    <button className="hover:text-slate-900 transition-colors"><MoreHorizontal size={18} /></button>
                  </div>
                </header>
                
                {activeContact?.bot_paused && (
                  <div className="bg-rose-50 border-b border-rose-100 px-8 py-3.5 flex items-center justify-between z-10 animate-in slide-in-from-top duration-350 shrink-0">
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">🤖</span>
                      <span className="text-xs font-black text-rose-700 uppercase tracking-wider">Auto-Bot is Paused — Human Agent Mode Active</span>
                    </div>
                    <button 
                      onClick={() => handleToggleBot(activeContact)}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm transition-all"
                    >
                      Resume Bot
                    </button>
                  </div>
                )}

                {/* Messages Feed */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 bg-slate-50/20 custom-scrollbar"
                >
                  <div className="flex flex-col items-center mb-3">
                    <span className="px-3 py-0.5 bg-white border border-slate-200 rounded-full text-[9px] font-extrabold text-slate-400 uppercase tracking-widest shadow-2xs">
                      Today
                    </span>
                  </div>

                  {activeConvo.messages.map((msg, i) => {
                    const isIncoming = msg.message_type === 'INCOMING';
                    const meta = msg.metadata || {};
                    const isDoc = meta.document || (msg.body && msg.body.includes('📄'));
                    const isImg = meta.image || (msg.body && msg.body.includes('📷'));
                    const isAudio = meta.audio || meta.voice || (msg.body && msg.body.includes('🎵'));
                    const isVid = meta.video || (msg.body && msg.body.includes('🎥'));
                    const mediaId = meta.document?.id || meta.image?.id || meta.audio?.id || meta.voice?.id || meta.video?.id;
                    const filename = meta.document?.filename || (isDoc ? msg.body.replace('📄 ', '').split(' - ')[0] : 'Document');
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
                    const downloadUrl = mediaId ? `${apiUrl}/api/media-proxy/?media_id=${mediaId}&filename=${encodeURIComponent(filename)}` : null;

                    return (
                      <div
                        key={msg.id || i} 
                        className={cn("flex flex-col", isIncoming ? "items-start" : "items-end")}
                      >
                        <div className={cn(
                          "max-w-[85%] md:max-w-[65%] p-2.5 px-4 rounded-2xl text-xs md:text-sm leading-snug shadow-2xs break-words whitespace-pre-wrap",
                          msg.message_type === 'INTERNAL' 
                            ? "bg-amber-100 text-amber-900 rounded-br-none border border-amber-200"
                            : isIncoming 
                              ? "bg-white text-slate-700 rounded-bl-none border border-slate-100" 
                              : "bg-emerald-600 text-white rounded-br-none shadow-emerald-100"
                        )}>
                          {msg.message_type === 'INTERNAL' && <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-700 mb-1"><Lock size={10} /> Internal Note</div>}
                          
                          {/* Rich Document Card */}
                          {isDoc && (
                            <div className="mb-2 p-3 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center gap-3 text-slate-800">
                              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                                <FileText size={20} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold truncate">{filename}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Document Attachment</p>
                              </div>
                              {downloadUrl && (
                                <a
                                  href={downloadUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-all flex items-center gap-1 text-xs font-bold shrink-0 shadow-xs"
                                >
                                  <Download size={13} />
                                  <span>Download</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Rich Image Preview */}
                          {isImg && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-slate-200/60 bg-slate-100 max-w-xs">
                              {downloadUrl ? (
                                <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="block relative group">
                                  <img src={downloadUrl} alt="Received attachment" className="w-full h-auto max-h-60 object-cover" />
                                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                                    <Download size={16} /> View Image
                                  </div>
                                </a>
                              ) : (
                                <div className="p-4 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                                  <ImageIcon size={18} className="text-slate-400" /> Photo Attachment
                                </div>
                              )}
                            </div>
                          )}

                          {/* Rich Audio Player */}
                          {isAudio && downloadUrl && (
                            <div className="mb-2">
                              <audio controls className="w-full max-w-xs h-9">
                                <source src={downloadUrl} />
                                Your browser does not support the audio element.
                              </audio>
                            </div>
                          )}

                          {/* Message Body text if not redundant */}
                          {(!isDoc && !isImg) && (msg.body || '📎 [Media Attachment]')}
                          {(isDoc || isImg) && meta.document?.caption && (
                            <p className="mt-1 text-xs font-medium">{meta.document.caption}</p>
                          )}
                        </div>
                        <div className="mt-2 flex items-center gap-2 px-1">
                          <p className="text-[9px] font-bold text-slate-300 uppercase">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          {!isIncoming && <CheckCheck size={12} className="text-emerald-500" />}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Reply Box */}
                <div className="p-3 md:p-8 border-t border-slate-50 bg-white">
                  <div className="bg-slate-50 rounded-2xl md:rounded-[32px] p-1.5 md:p-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all border border-slate-100 shadow-inner">
                    <textarea 
                      rows={1}
                      placeholder="Type a message..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                      className="w-full bg-transparent p-2 md:p-4 text-sm font-medium outline-none resize-none max-h-32"
                    />
                    <div className="flex items-center justify-between p-2">
                      <div className="flex items-center gap-2 px-2">
                        <button onClick={() => setIsInternal(!isInternal)} className={cn("px-3 py-1.5 flex items-center gap-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all", isInternal ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-400 hover:bg-slate-200")}>
                          <Lock size={12} /> {isInternal ? 'Internal' : 'Public'}
                        </button>
                        <button onClick={handleSuggestDraft} disabled={isDrafting} className="px-3 py-1.5 flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all">
                          {isDrafting ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />} AI Draft
                        </button>
                      </div>
                      <button onClick={handleSendMessage} disabled={!replyText.trim() || isSending} className={cn("text-white p-4 rounded-2xl transition-all shadow-xl", replyText.trim() && !isSending ? (isInternal ? "bg-amber-500 hover:bg-amber-600 shadow-amber-200" : "bg-emerald-600 hover:bg-slate-900 shadow-emerald-100") : "bg-slate-300 cursor-not-allowed shadow-none")}>
                        {isSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 md:p-20">
                <div className="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                  <MessageSquare size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">No Active Thread</h3>
                <p className="text-sm text-slate-400 italic max-w-xs">Select a conversation from the sidebar to start replying.</p>
              </div>
            )}
          </main>

          {/* Column 3: Customer Details (Intercom Sidebar) */}
          <aside className="w-64 md:w-72 border-l border-slate-100 bg-white p-4 md:p-5 overflow-y-auto shrink-0 hidden xl:block">
            {activeConvo ? (
              <div className="space-y-5">
                {/* Profile Card */}
                <div className="text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center text-base font-bold mx-auto mb-2 shadow-md">
                    {activeConvo.name[0].toUpperCase()}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-0.5">{activeConvo.name}</h3>
                  <div className="flex items-center justify-center gap-1.5">
                    <span className={cn("w-1.5 h-1.5 rounded-full", activeConvo.channel === 'GMAIL' ? "bg-red-500" : activeConvo.channel === 'FACEBOOK' ? "bg-blue-600" : activeConvo.channel === 'INSTAGRAM' ? "bg-pink-500" : "bg-emerald-500")} />
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                      Active via {activeConvo.channel === 'GMAIL' ? 'Gmail' : activeConvo.channel === 'FACEBOOK' ? 'Facebook' : activeConvo.channel === 'INSTAGRAM' ? 'Instagram' : 'WhatsApp'}
                    </p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Contact Detail</p>
                  <div className="flex items-center gap-2.5 p-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-400 shadow-xs"><Phone size={12} /></div>
                    <span className="text-xs font-semibold text-slate-700 truncate">{activeConvo.id}</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2 px-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center text-slate-400 shadow-xs"><MapPin size={12} /></div>
                    <span className="text-xs font-semibold text-slate-700">Mumbai, India</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Actions</p>
                  <button className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2.5 hover:bg-slate-50 transition-all cursor-pointer">
                    <User size={13} className="text-slate-400" /> View Profile
                  </button>
                  {activeContact && (
                    <button 
                      onClick={() => handleToggleBot(activeContact)}
                      className={cn(
                        "w-full py-2 px-3 border rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer",
                        activeContact.bot_paused 
                          ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/50" 
                          : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                      )}
                    >
                      <Zap size={13} className={activeContact.bot_paused ? "text-rose-600 animate-pulse" : "text-slate-400"} />
                      {activeContact.bot_paused ? "Resume Auto-Bot" : "Pause Auto-Bot"}
                    </button>
                  )}
                  {activeContact && (
                    <button 
                      onClick={handleArchive}
                      className={cn(
                        "w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold flex items-center gap-2.5 transition-all cursor-pointer",
                        activeContact.is_archived ? "text-amber-600" : "text-slate-700"
                      )}
                    >
                      <Archive size={13} className={activeContact.is_archived ? "text-amber-600" : "text-slate-400"} /> 
                      {activeContact.is_archived ? "Unarchive Convo" : "Archive Convo"}
                    </button>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2">Tags</p>
                  <div className="flex flex-wrap gap-1.5">
                    {['Priority', 'WhatsApp', 'Support'].map(tag => (
                      <span key={tag} className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-md text-[9px] font-extrabold uppercase tracking-wider border border-emerald-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-center opacity-20 grayscale">
                <User size={36} />
              </div>
            )}
          </aside>
        </div>
      </div>
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #10B981;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #059669;
        }
      `}</style>
    </DashboardLayout>
  );
};

export default ClientInboxPage;




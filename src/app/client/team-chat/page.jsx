'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, Loader2, MessagesSquare, User, Hash, Plus, X, Users } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { API_BASE_URL } from '@/config/apiConfig';

const API = API_BASE_URL;

export default function TeamChatPage() {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [mobileShowChat, setMobileShowChat] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('user');
      if (stored) {
        try { setCurrentUser(JSON.parse(stored)); } catch {}
      }
    }
  }, []);

  // Fetch channels
  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/team/channels/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(Array.isArray(res.data) ? res.data : (res.data?.results || []));
      if (res.data.length > 0 && !activeChannelId) {
        setActiveChannelId(res.data[0].id);
      }
    } catch (err) {
      console.error('Channels fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for active channel
  const fetchMessages = async () => {
    if (!activeChannelId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API}/api/team/channel-messages/?channel_id=${activeChannelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Messages fetch failed', err);
    }
  };

  useEffect(() => { fetchChannels(); }, []);

  useEffect(() => {
    if (activeChannelId) {
      fetchMessages();
      pollRef.current = setInterval(fetchMessages, 3000);
      return () => clearInterval(pollRef.current);
    }
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannelId || sending) return;

    const text = newMessage.trim();
    setNewMessage('');
    setSending(true);

    // Optimistic
    const optimistic = {
      id: `temp_${Date.now()}`,
      sender_name: currentUser?.name || currentUser?.username || 'You',
      text,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/team/channel-messages/`, {
        channel_id: activeChannelId,
        text,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Send failed', err);
    } finally {
      setSending(false);
    }
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API}/api/team/channels/`, {
        name: newChannelName.trim(),
      }, { headers: { Authorization: `Bearer ${token}` } });
      setChannels(prev => [...prev, res.data]);
      setActiveChannelId(res.data.id);
      setNewChannelName('');
      setShowNewChannel(false);
      setMobileShowChat(true);
    } catch (err) {
      console.error('Create channel failed', err);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId);

  const isMe = (msg) => {
    if (!currentUser) return false;
    return (
      (currentUser.id && String(currentUser.id) === String(msg.sender)) ||
      (currentUser.email && currentUser.email === msg.sender_name) ||
      (currentUser.name && currentUser.name === msg.sender_name) ||
      (currentUser.username && currentUser.username === msg.sender_name)
    );
  };

  return (
    <DashboardLayout>
      <div className="h-full flex flex-col min-h-0">
        {/* Header */}
        <div className="shrink-0 mb-4">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Team Chat</h1>
          <p className="text-sm text-slate-500 mt-0.5">Communicate with your team & admin in real time.</p>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 min-h-0 flex bg-white rounded-2xl border border-slate-200 overflow-hidden">

          {/* ── Channels Sidebar ── */}
          <div className={`w-full sm:w-64 bg-slate-50/80 border-r border-slate-100 flex flex-col shrink-0 ${mobileShowChat ? 'hidden sm:flex' : 'flex'}`}>
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Channels</h3>
              <button
                onClick={() => setShowNewChannel(true)}
                className="p-1.5 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
              >
                <Plus size={15} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
              {loading ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={20} className="animate-spin text-emerald-500" />
                </div>
              ) : channels.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  <MessagesSquare size={24} className="mx-auto mb-2 text-slate-300" />
                  No channels yet
                </div>
              ) : (
                channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => { setActiveChannelId(ch.id); setMobileShowChat(true); }}
                    className={`w-full px-3 py-2.5 rounded-xl text-left transition-all flex items-center gap-2.5 text-xs font-semibold ${
                      ch.id === activeChannelId
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <Hash size={13} className={ch.id === activeChannelId ? 'text-emerald-200' : 'text-slate-400'} />
                    <span className="truncate">{ch.name}</span>
                  </button>
                ))
              )}
            </div>

            {/* New Channel Form */}
            {showNewChannel && (
              <div className="p-3 border-t border-slate-100">
                <form onSubmit={handleCreateChannel} className="space-y-2">
                  <input
                    type="text"
                    value={newChannelName}
                    onChange={e => setNewChannelName(e.target.value)}
                    placeholder="channel-name"
                    autoFocus
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400/20 focus:border-emerald-400"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => { setShowNewChannel(false); setNewChannelName(''); }}
                      className="flex-1 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* User info */}
            <div className="p-3 border-t border-slate-100">
              <div className="flex items-center gap-2.5 px-2 py-2 bg-white rounded-xl border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || currentUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-800 truncate">{currentUser?.username || currentUser?.name || 'User'}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser?.enterprise_role || 'Team Member'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Chat Area ── */}
          <div className={`flex-1 flex flex-col min-w-0 ${!mobileShowChat ? 'hidden sm:flex' : 'flex'}`}>
            {/* Chat Header */}
            <div className="px-4 sm:px-5 py-3 border-b border-slate-100 flex items-center gap-3 bg-white shrink-0">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileShowChat(false)}
                className="sm:hidden p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                ←
              </button>
              <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600 shrink-0">
                <Hash size={16} />
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-slate-900 truncate">
                  {activeChannel ? `#${activeChannel.name}` : 'Select a channel'}
                </h3>
                {activeChannel?.description && (
                  <p className="text-[10px] text-slate-400 truncate">{activeChannel.description}</p>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
              {!activeChannelId ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessagesSquare size={40} className="text-slate-200" />
                  <p className="text-sm font-medium">Select a channel to start chatting</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                  <MessagesSquare size={36} className="text-slate-200" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs">Be the first to send a message!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const mine = isMe(msg);
                  return (
                    <div key={msg.id || i} className={`flex gap-2.5 ${mine ? 'flex-row-reverse' : ''}`}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                        mine ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {(msg.sender_name || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className={`max-w-[75%] ${mine ? 'text-right' : ''}`}>
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className={`text-[10px] font-semibold ${mine ? 'text-emerald-600 ml-auto' : 'text-slate-500'}`}>
                            {mine ? 'You' : msg.sender_name}
                          </span>
                          <span className="text-[9px] text-slate-300">
                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed inline-block ${
                          mine
                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                            : 'bg-slate-100 text-slate-800 rounded-tl-sm'
                        }`}>
                          {msg.text || msg.body}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            {activeChannelId && (
              <div className="p-3 sm:p-4 border-t border-slate-100 bg-white shrink-0">
                <form onSubmit={handleSend} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder={`Message #${activeChannel?.name || 'channel'}...`}
                    className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                  >
                    <Send size={16} />
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Send, User, MessageCircle, Hash, Plus, Users, ChevronLeft } from 'lucide-react';

const API = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

export default function TeamChatDrawer({ isOpen, onClose }) {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try { setCurrentUser(JSON.parse(storedUser)); } catch {}
      }
    }
  }, []);

  // Fetch channels when drawer opens
  useEffect(() => {
    if (!isOpen) return;
    const fetchChannels = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API}/api/team/channels/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChannels(res.data);
        if (res.data.length > 0 && !activeChannelId) {
          setActiveChannelId(res.data[0].id);
          setShowChannels(false);
        }
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch channels', err.message);
        setLoading(false);
      }
    };
    fetchChannels();
  }, [isOpen]);

  // Fetch messages for active channel + polling
  useEffect(() => {
    if (!activeChannelId || !isOpen) return;

    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${API}/api/team/channel-messages/?channel_id=${activeChannelId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
      } catch (err) {
        console.error('Failed to fetch messages', err.message);
      }
    };

    fetchMessages();
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeChannelId, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChannelId) return;

    const textToSend = newMessage.trim();
    setNewMessage('');

    // Optimistic update
    const optimistic = {
      id: `temp_${Date.now()}`,
      sender_name: currentUser?.name || currentUser?.email || 'You',
      text: textToSend,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API}/api/team/channel-messages/`, {
        channel_id: activeChannelId,
        text: textToSend,
      }, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error('Failed to send message', err.message);
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
      setShowChannels(false);
    } catch (err) {
      console.error('Failed to create channel', err.message);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId);
  const isMe = (msg) => {
    if (!currentUser) return false;
    return (
      (currentUser.id && String(currentUser.id) === String(msg.sender)) ||
      (currentUser.email && currentUser.email === msg.sender_name) ||
      (currentUser.name && currentUser.name === msg.sender_name)
    );
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 transform transition-transform duration-300">
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            {activeChannelId && !showChannels && (
              <button
                onClick={() => setShowChannels(true)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            <div className="w-9 h-9 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100">
              {showChannels ? <Users size={18} /> : <Hash size={18} />}
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm leading-none">
                {showChannels ? 'Team Channels' : `#${activeChannel?.name || 'chat'}`}
              </h2>
              <p className="text-[10px] text-slate-400 mt-0.5 font-medium">
                {showChannels
                  ? `${channels.length} channel${channels.length !== 1 ? 's' : ''}`
                  : activeChannel?.description || 'Group conversation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Channel List View ── */}
        {showChannels ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-1.5">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-emerald-500 border-t-transparent" />
              </div>
            ) : (
              <>
                {channels.map(ch => (
                  <button
                    key={ch.id}
                    onClick={() => { setActiveChannelId(ch.id); setShowChannels(false); }}
                    className={`w-full px-4 py-3 rounded-2xl text-left transition-all flex items-center gap-3 group ${
                      ch.id === activeChannelId
                        ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                        : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      ch.id === activeChannelId
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                    }`}>
                      <Hash size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{ch.name}</p>
                      {ch.description && (
                        <p className="text-[10px] text-slate-400 truncate">{ch.description}</p>
                      )}
                    </div>
                    <div className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                      ch.channel_type === 'PRIVATE'
                        ? 'bg-amber-50 text-amber-600'
                        : 'bg-slate-50 text-slate-400'
                    }`}>
                      {ch.channel_type === 'PRIVATE' ? 'Private' : 'Public'}
                    </div>
                  </button>
                ))}

                {/* Create new channel */}
                {showNewChannel ? (
                  <form onSubmit={handleCreateChannel} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 mt-2">
                    <input
                      type="text"
                      value={newChannelName}
                      onChange={(e) => setNewChannelName(e.target.value)}
                      placeholder="channel-name"
                      autoFocus
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => { setShowNewChannel(false); setNewChannelName(''); }}
                        className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1.5 text-xs bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                      >
                        Create
                      </button>
                    </div>
                  </form>
                ) : (
                  <button
                    onClick={() => setShowNewChannel(true)}
                    className="w-full px-4 py-3 rounded-2xl text-left text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center gap-3 border border-dashed border-slate-200 hover:border-emerald-300 mt-2"
                  >
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50">
                      <Plus size={14} />
                    </div>
                    <span className="text-sm font-medium">Create New Channel</span>
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <>
            {/* ── Messages View ── */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                  <MessageCircle size={36} className="text-slate-200" />
                  <p className="text-sm font-medium">No messages yet</p>
                  <p className="text-xs">Start the conversation in #{activeChannel?.name}!</p>
                </div>
              ) : (
                messages.map((msg, i) => {
                  const mine = isMe(msg);
                  return (
                    <div key={msg.id || i} className={`flex flex-col ${mine ? 'items-end' : 'items-start'}`}>
                      <span className="text-[10px] font-semibold text-slate-400 mb-1 px-1 flex items-center gap-1">
                        {!mine && <User size={10} className="text-emerald-500" />}
                        {mine ? 'You' : msg.sender_name}
                      </span>
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                          mine
                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                            : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                        }`}
                      >
                        {msg.text || msg.body}
                      </div>
                      <span className={`text-[9px] mt-1 px-1 ${mine ? 'text-slate-300' : 'text-slate-400'}`}>
                        {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* ── Input ── */}
            <div className="p-3 bg-white border-t border-slate-100 shrink-0">
              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={`Message #${activeChannel?.name || 'channel'}...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0 shadow-sm"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </>
  );
}

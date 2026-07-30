'use client';

import React, { useState, useEffect } from 'react';
import { Hash, Lock, Plus, Send, Paperclip, MessageSquare, Volume2, User, Search, Pin } from 'lucide-react';
import axios from 'axios';

export default function TeamChatWindow({ currentUser }) {
  const [channels, setChannels] = useState([]);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fetchChannels = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/channels/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChannels(res.data);
      if (res.data.length > 0 && !activeChannelId) {
        setActiveChannelId(res.data[0].id);
      }
    } catch (err) {
      console.error('Failed to fetch channels:', err);
    }
  };

  const fetchMessages = async () => {
    if (!activeChannelId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/channel-messages/?channel_id=${activeChannelId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to fetch chat messages:', err);
    }
  };

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    if (activeChannelId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChannelId]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/channels/`, {
        name: newChannelName.trim()
      }, { headers: { Authorization: `Bearer ${token}` } });

      setChannels([...channels, res.data]);
      setActiveChannelId(res.data.id);
      setNewChannelName('');
      setShowChannelModal(false);
    } catch (err) {
      console.error('Failed to create channel:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChannelId || isSending) return;
    const textToSend = messageText.trim();
    setMessageText('');
    setIsSending(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/channel-messages/`, {
        channel_id: activeChannelId,
        text: textToSend
      }, { headers: { Authorization: `Bearer ${token}` } });

      fetchMessages();
    } catch (err) {
      console.error('Failed to send chat message:', err);
    } flex {
      setIsSending(false);
    }
  };

  const activeChannel = channels.find(c => c.id === activeChannelId);

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex h-[620px] overflow-hidden">
      
      {/* Channels Sidebar */}
      <div className="w-64 bg-slate-50/80 border-r border-slate-200/60 p-4 flex flex-col justify-between shrink-0">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">Workspace Channels</h3>
            <button
              onClick={() => setShowChannelModal(true)}
              className="p-1 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-200/50"
            >
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[480px]">
            {channels.map((c) => {
              const isActive = c.id === activeChannelId;
              return (
                <button
                  key={c.id}
                  onClick={() => setActiveChannelId(c.id)}
                  className={`w-full px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-200/50'
                  }`}
                >
                  <Hash size={14} className={isActive ? 'text-indigo-200' : 'text-slate-400'} />
                  <span className="truncate">{c.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-white rounded-2xl border border-slate-200/60 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0">
            {currentUser?.username?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="overflow-hidden text-xs">
            <p className="font-semibold text-slate-800 truncate">{currentUser?.username || 'User'}</p>
            <p className="text-[10px] text-slate-400 truncate">{currentUser?.enterprise_role || 'Member'}</p>
          </div>
        </div>
      </div>

      {/* Main Chat Stream */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
          <div className="flex items-center gap-2">
            <Hash size={18} className="text-indigo-600" />
            <h3 className="font-bold text-slate-900 text-sm">#{activeChannel?.name || 'select-channel'}</h3>
            <span className="text-xs text-slate-400 ml-2">{activeChannel?.description}</span>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m) => {
            const isMe = m.sender_name === currentUser?.username;
            return (
              <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                  {m.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={`max-w-md p-3.5 rounded-2xl ${
                  isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <div className="flex justify-between items-center gap-4 mb-1">
                    <span className={`font-semibold text-[11px] ${isMe ? 'text-indigo-100' : 'text-slate-700'}`}>{m.sender_name}</span>
                    <span className={`text-[9px] ${isMe ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="leading-relaxed text-xs">{m.text}</p>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare size={32} className="text-slate-300" />
              <p className="text-xs">No messages in this channel yet. Start the conversation!</p>
            </div>
          )}
        </div>

        {/* Message Input Box */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 bg-white">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder={`Message #${activeChannel?.name || 'channel'}...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-xs"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center shrink-0 shadow-md shadow-indigo-200"
          >
            <Send size={15} />
          </button>
        </form>

      </div>

      {/* New Channel Modal */}
      {showChannelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-xl border border-slate-100">
            <h3 className="font-bold text-slate-900 text-base mb-2">Create Channel</h3>
            <form onSubmit={handleCreateChannel} className="space-y-4 text-xs">
              <input
                type="text"
                value={newChannelName}
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="channel-name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none"
                required
              />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowChannelModal(false)} className="px-4 py-2 rounded-xl text-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-medium">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

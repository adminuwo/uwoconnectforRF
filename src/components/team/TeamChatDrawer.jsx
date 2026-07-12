'use client';
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { X, Send, User, MessageCircle } from 'lucide-react';

export default function TeamChatDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const ws = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    
    // Fetch initial messages
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/team/chat/`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setMessages(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch chat history', err.message);
        setLoading(false);
      }
    };
    fetchMessages();

    // Setup WebSocket
    const token = localStorage.getItem('token');
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://127.0.0.1:8080';
    ws.current = new WebSocket(`${wsUrl}/ws/team-chat/?token=${token}`);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'new_team_message') {
        setMessages((prev) => [...prev, data.message]);
      }
    };

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/team/chat/`,
        { body: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-[#0B0D11]/95 backdrop-blur-md shadow-2xl z-50 flex flex-col border-l border-white/10 transform transition-transform duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#030712]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10B981]/10 rounded-full flex items-center justify-center text-[#10B981] border border-[#10B981]/20">
              <MessageCircle size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white">Team Chat</h2>
              <p className="text-xs text-[#8E99A8]">Workspace discussions</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#030712]/40">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#10B981]"></div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-[#8E99A8]">
              <MessageCircle size={40} className="mb-2 opacity-20 text-[#10B981]" />
              <p className="text-sm">No messages yet.</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, i) => {
              const isMe =
                (currentUser?.id && String(currentUser.id) === String(msg.sender)) ||
                (currentUser?.email && currentUser.email === msg.sender_name);
              return (
                <div key={i} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <span className="text-[10px] font-medium text-[#8E99A8] mb-1 px-1 flex items-center gap-1">
                    {!isMe && <User size={10} className="text-[#10B981]" />}
                    {isMe ? 'You' : msg.sender_name}
                  </span>
                  <div 
                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${
                      isMe 
                        ? 'bg-[#10B981] text-white rounded-tr-sm shadow-[0_2px_12px_rgba(16,185,129,0.2)]' 
                        : 'bg-[#11141B] border border-white/5 text-[#E2E8F0] rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.body}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 bg-[#0B0D11] border-t border-white/10">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-[#030712] border border-white/10 rounded-full text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#10B981]/20 focus:border-[#10B981] transition-all placeholder:text-[#8E99A8]"
            />
            <button 
              type="submit"
              disabled={!newMessage.trim()}
              className="w-10 h-10 bg-[#10B981] hover:bg-[#059669] text-white rounded-full flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_12px_rgba(16,185,129,0.25)]"
            >
              <Send size={16} className="ml-1" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

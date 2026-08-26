'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Hash, Plus, Send, MessageSquare, Loader2, FolderKanban, 
  Users, Circle, User, ShieldCheck, Briefcase, Lock
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function TeamChatWindow({ 
  currentUser: initialUser, 
  channels: propsChannels = [], 
  projects: propsProjects = [],
  members: propsMembers = [],
  onChannelCreated 
}) {
  const [channels, setChannels] = useState(propsChannels || []);
  const [projectsList, setProjectsList] = useState(propsProjects || []);
  const [membersList, setMembersList] = useState(propsMembers || []);
  const [activeChannelId, setActiveChannelId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [showChannelModal, setShowChannelModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [loadingChannels, setLoadingChannels] = useState(false);
  const messagesEndRef = useRef(null);

  const [user, setUser] = useState(() => {
    if (initialUser) return initialUser;
    if (typeof window !== 'undefined') {
      try {
        return JSON.parse(localStorage.getItem('user') || '{}');
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    } else if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(stored);
      } catch (e) {}
    }
  }, [initialUser]);

  // Sync props to state
  useEffect(() => {
    if (propsChannels && propsChannels.length > 0) {
      setChannels(propsChannels);
      setActiveChannelId(prev => {
        if (prev && propsChannels.some(c => String(c.id || c._id) === String(prev))) {
          return String(prev);
        }
        return String(propsChannels[0].id || propsChannels[0]._id);
      });
    }
  }, [propsChannels]);

  useEffect(() => {
    if (propsProjects && propsProjects.length > 0) {
      setProjectsList(propsProjects);
    }
  }, [propsProjects]);

  useEffect(() => {
    if (propsMembers && propsMembers.length > 0) {
      setMembersList(propsMembers);
    }
  }, [propsMembers]);

  const fetchChannels = async () => {
    try {
      setLoadingChannels(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/channels/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setChannels(data);
      if (data.length > 0) {
        setActiveChannelId(prev => {
          if (prev && data.some(c => String(c.id || c._id) === String(prev))) {
            return String(prev);
          }
          return String(data[0].id || data[0]._id);
        });
      }
    } catch (err) {
      console.warn('Failed to fetch channels:', err);
    } finally {
      setLoadingChannels(false);
    }
  };

  const fetchMembersAndProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const mRes = await axios.get(`${API_BASE_URL}/api/team/members/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const mData = Array.isArray(mRes.data) ? mRes.data : (mRes.data?.results || []);
      if (mData.length > 0) setMembersList(mData);

      const pRes = await axios.get(`${API_BASE_URL}/api/team/projects/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const pData = Array.isArray(pRes.data) ? pRes.data : (pRes.data?.results || []);
      if (pData.length > 0) setProjectsList(pData);
    } catch (e) {
      console.warn('Fallback fetch members/projects error:', e);
    }
  };

  const fetchMessages = async () => {
    if (!activeChannelId) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/channel-messages/?channel_id=${activeChannelId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      const data = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setMessages(data);
    } catch (err) {
      console.warn('Failed to fetch chat messages:', err);
    }
  };

  useEffect(() => {
    fetchChannels();
    fetchMembersAndProjects();
  }, []);

  useEffect(() => {
    if (activeChannelId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 3000);
      return () => clearInterval(interval);
    }
  }, [activeChannelId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Helper to generate consistent deterministic shared DM slug for any two users
  const getDmChannelSlug = (userA, userB) => {
    const slugA = (userA?.username || userA?.email || 'usera').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const slugB = (userB?.username || userB?.email || 'userb').toLowerCase().replace(/[^a-z0-9]/g, '-');
    const pair = [slugA, slugB].sort();
    return `dm-${pair[0]}_${pair[1]}`;
  };

  // Organize channels into Categories
  const { workspaceChannels, projectChannels, otherChannels } = useMemo(() => {
    const ws = [];
    const proj = [];
    const other = [];

    channels.forEach(c => {
      const name = (c.name || '').toLowerCase();
      if (name === 'general' || name === 'announcements') {
        ws.push(c);
      } else if (name.startsWith('proj-')) {
        proj.push(c);
      } else if (!name.startsWith('dm-')) {
        other.push(c);
      }
    });

    return { workspaceChannels: ws, projectChannels: proj, otherChannels: other };
  }, [channels]);

  // Active other team members list (EXCLUDING self/current user)
  const activeMembers = useMemo(() => {
    const currentUserId = String(user?.id || user?._id || '');
    const currentUsername = (user?.username || '').toLowerCase();
    const currentUserEmail = (user?.email || '').toLowerCase();

    return (Array.isArray(membersList) ? membersList : []).filter(m => {
      if (m.status === 'SUSPENDED') return false;
      const mId = String(m.id || m._id || '');
      const mUsername = (m.username || '').toLowerCase();
      const mEmail = (m.email || '').toLowerCase();

      // Exclude self
      if (currentUserId && mId === currentUserId) return false;
      if (currentUserEmail && mEmail === currentUserEmail) return false;
      if (currentUsername && mUsername === currentUsername) return false;
      return true;
    });
  }, [membersList, user]);

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/team/channels/`, {
        name: newChannelName.trim()
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      const newCh = res.data;
      setChannels(prev => [...prev, newCh]);
      setActiveChannelId(String(newCh.id || newCh._id));
      setNewChannelName('');
      setShowChannelModal(false);
      if (onChannelCreated) onChannelCreated();
    } catch (err) {
      console.error('Failed to create channel:', err);
    }
  };

  // Direct Message selection using deterministic shared pair slug
  const handleSelectMember = async (member) => {
    const targetName = getDmChannelSlug(user, member);
    const existing = channels.find(c => c.name === targetName);
    
    if (existing) {
      setActiveChannelId(String(existing.id || existing._id));
    } else {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.post(`${API_BASE_URL}/api/team/channels/`, {
          name: targetName,
          description: `Direct message between ${user.first_name || user.username} and ${member.first_name || member.username}`,
          channel_type: 'DIRECT'
        }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

        const newCh = res.data;
        setChannels(prev => [...prev, newCh]);
        setActiveChannelId(String(newCh.id || newCh._id));
        if (onChannelCreated) onChannelCreated();
      } catch (err) {
        if (channels.length > 0) setActiveChannelId(String(channels[0].id || channels[0]._id));
      }
    }
  };

  const handleSendMessage = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!messageText.trim() || isSending) return;
    
    let targetChannelId = activeChannelId;
    if (!targetChannelId && channels.length > 0) {
      targetChannelId = String(channels[0].id || channels[0]._id);
      setActiveChannelId(targetChannelId);
    }
    if (!targetChannelId) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setIsSending(true);

    // Optimistic update
    const tempMsg = {
      id: `temp_${Date.now()}`,
      sender_name: user?.name || user?.first_name || user?.username || user?.email || 'You',
      text: textToSend,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_BASE_URL}/api/team/channel-messages/`, {
        channel_id: targetChannelId,
        text: textToSend
      }, { headers: token ? { Authorization: `Bearer ${token}` } : {} });

      await fetchMessages();
    } catch (err) {
      console.error('Failed to send chat message:', err);
      setMessageText(textToSend); // Restore if failed
    } finally {
      setIsSending(false);
    }
  };

  const activeChannel = channels.find(c => String(c.id || c._id) === String(activeChannelId)) || (channels.length > 0 ? channels[0] : null);

  // Format channel name for clean display
  const formatChannelDisplayName = (ch) => {
    if (!ch) return 'general';
    const name = ch.name || '';
    if (name.startsWith('proj-')) {
      const raw = name.replace('proj-', '');
      const matchedProj = projectsList.find(p => p.name?.toLowerCase().replace(/\s+/g, '-') === raw);
      return matchedProj ? matchedProj.name : raw.toUpperCase();
    }
    if (name.startsWith('dm-')) {
      const raw = name.replace('dm-', '');
      const parts = raw.split('_');
      const currentSlug = (user?.username || user?.email || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const otherSlug = parts.find(p => p !== currentSlug) || parts[0];
      const matchedMember = membersList.find(m => {
        const uSlug = (m.username || m.email || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
        return uSlug === otherSlug;
      });
      if (matchedMember) {
        return matchedMember.first_name ? `${matchedMember.first_name} ${matchedMember.last_name || ''}`.trim() : matchedMember.username;
      }
      return otherSlug;
    }
    return name;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm flex h-[620px] overflow-hidden">
      
      {/* ── LEFT SIDEBAR: CHANNELS, PROJECTS & TEAM MEMBERS ── */}
      <div className="w-68 bg-slate-50/80 border-r border-slate-200/60 p-3.5 flex flex-col justify-between shrink-0">
        
        <div className="overflow-y-auto space-y-4 pr-1 max-h-[510px]">
          
          {/* SECTION 1: WORKSPACE CHANNELS */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Workspace Channels
              </span>
              <button
                onClick={() => setShowChannelModal(true)}
                className="p-1 text-slate-400 hover:text-emerald-600 rounded-lg hover:bg-slate-200/60 cursor-pointer transition-colors"
                title="Create Channel"
              >
                <Plus size={14} />
              </button>
            </div>

            <div className="space-y-0.5">
              {workspaceChannels.length === 0 ? (
                <div className="space-y-0.5">
                  <button
                    onClick={() => setActiveChannelId(channels[0]?.id)}
                    className="w-full px-2.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white flex items-center gap-2"
                  >
                    <Hash size={13} className="text-emerald-100" />
                    <span>general</span>
                  </button>
                </div>
              ) : (
                workspaceChannels.map((c) => {
                  const channelId = String(c.id || c._id);
                  const isActive = channelId === String(activeChannelId) || (!activeChannelId && channelId === String(workspaceChannels[0]?.id));
                  return (
                    <button
                      key={channelId}
                      onClick={() => setActiveChannelId(channelId)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      <Hash size={13} className={isActive ? 'text-emerald-100' : 'text-slate-400'} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* SECTION 2: PROJECTS (Only assigned projects for team member, all for client) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <FolderKanban size={11} className="text-emerald-600" />
                Assigned Projects ({projectChannels.length})
              </span>
            </div>

            <div className="space-y-0.5">
              {projectChannels.length === 0 ? (
                <div className="px-2 py-1.5 text-[11px] text-slate-400 italic">
                  No assigned projects yet
                </div>
              ) : (
                projectChannels.map((c) => {
                  const channelId = String(c.id || c._id);
                  const isActive = channelId === String(activeChannelId);
                  const displayName = formatChannelDisplayName(c);
                  return (
                    <button
                      key={channelId}
                      onClick={() => setActiveChannelId(channelId)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FolderKanban size={13} className={isActive ? 'text-emerald-100' : 'text-emerald-600'} />
                        <span className="truncate">{displayName}</span>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase shrink-0 ${
                        isActive ? 'bg-emerald-700/60 text-emerald-100' : 'bg-emerald-50 text-emerald-700'
                      }`}>
                        Project
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* SECTION 3: DIRECT MESSAGES & TEAM MEMBERS (Excluding self) */}
          <div>
            <div className="flex items-center justify-between px-2 mb-1.5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Users size={11} className="text-indigo-600" />
                Team Members ({activeMembers.length})
              </span>
            </div>

            <div className="space-y-0.5">
              {activeMembers.length === 0 ? (
                <div className="px-2 py-1.5 text-[11px] text-slate-400 italic">
                  No other team members
                </div>
              ) : (
                activeMembers.map((m) => {
                  const targetDmName = getDmChannelSlug(user, m);
                  const isActive = activeChannel?.name === targetDmName;
                  const fullName = m.first_name ? `${m.first_name} ${m.last_name || ''}`.trim() : (m.username || m.email || 'Member');

                  return (
                    <button
                      key={m.id || m._id}
                      onClick={() => handleSelectMember(m)}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-between gap-2 transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:bg-slate-200/50'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="relative shrink-0">
                          <div className={`w-5 h-5 rounded-md flex items-center justify-center font-bold text-[9px] ${
                            isActive ? 'bg-white text-emerald-800' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {fullName.charAt(0).toUpperCase()}
                          </div>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ring-1 ring-white absolute -top-0.5 -right-0.5" />
                        </div>
                        <span className="truncate">{fullName}</span>
                      </div>

                      <span className={`text-[8px] font-bold px-1 rounded uppercase shrink-0 ${
                        isActive 
                          ? 'bg-emerald-700/60 text-emerald-100' 
                          : (m.role === 'CLIENT' || m.enterprise_role === 'CLIENT' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-500')
                      }`}>
                        {m.role === 'CLIENT' || m.enterprise_role === 'CLIENT' ? 'Client' : 'Agent'}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Current Logged In User Pill (Bottom) */}
        <div className="pt-2 border-t border-slate-200/70">
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200/70 flex items-center gap-2.5 shadow-2xs">
            <div className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0">
              {(user?.name || user?.first_name || user?.username || 'U').charAt(0)?.toUpperCase()}
            </div>
            <div className="overflow-hidden text-xs min-w-0">
              <p className="font-bold text-slate-800 truncate leading-snug">
                {user?.name || user?.first_name || user?.username || 'User'} (You)
              </p>
              <p className="text-[9px] text-slate-400 truncate leading-none">
                {user?.enterprise_role || user?.role || 'Member'}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* ── RIGHT MAIN AREA: CHAT STREAM & COMPOSER ── */}
      <div className="flex-1 flex flex-col bg-white">
        
        {/* Chat Header */}
        <div className="px-6 py-3.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/40">
          <div className="flex items-center gap-2.5">
            {activeChannel?.name?.startsWith('proj-') ? (
              <FolderKanban size={18} className="text-emerald-600" />
            ) : activeChannel?.name?.startsWith('dm-') ? (
              <User size={18} className="text-indigo-600" />
            ) : (
              <Hash size={18} className="text-emerald-600" />
            )}
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                <span>
                  {activeChannel?.name?.startsWith('dm-') ? '' : '#'}
                  {formatChannelDisplayName(activeChannel)}
                </span>
                {activeChannel?.name?.startsWith('proj-') && (
                  <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    Project Channel
                  </span>
                )}
                {activeChannel?.name?.startsWith('dm-') && (
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                    Direct Message
                  </span>
                )}
              </h3>
              <p className="text-[10px] text-slate-400 leading-none mt-0.5">
                {activeChannel?.description || 'Active workspace discussion'}
              </p>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {messages.map((m) => {
            const isMe = m.sender_name === user?.username || m.sender_name === user?.email || m.sender_name === user?.name;
            return (
              <div key={m.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0">
                  {m.sender_name?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <div className={`max-w-md p-3.5 rounded-2xl ${
                  isMe ? 'bg-emerald-600 text-white rounded-tr-none shadow-xs' : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  <div className="flex justify-between items-center gap-4 mb-1">
                    <span className={`font-bold text-[11px] ${isMe ? 'text-emerald-100' : 'text-slate-700'}`}>{m.sender_name}</span>
                    <span className={`text-[9px] ${isMe ? 'text-emerald-200' : 'text-slate-400'}`}>
                      {m.created_at ? new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="leading-relaxed text-xs font-medium">{m.text}</p>
                </div>
              </div>
            );
          })}

          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
              <MessageSquare size={32} className="text-slate-300" />
              <p className="text-xs font-medium">No messages in this channel yet. Start the conversation!</p>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box (With Green Send Button) */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-100 flex gap-2 bg-white">
          <input
            type="text"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage(e);
              }
            }}
            placeholder={activeChannel?.name?.startsWith('dm-') ? `Message ${formatChannelDisplayName(activeChannel)}...` : `Message #${formatChannelDisplayName(activeChannel)}...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-xs text-slate-800 font-medium"
          />
          <button
            type="submit"
            disabled={isSending || !messageText.trim()}
            className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold flex items-center justify-center shrink-0 shadow-md shadow-emerald-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title="Send Message"
          >
            {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
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
                <button type="button" onClick={() => setShowChannelModal(false)} className="px-4 py-2 rounded-xl text-slate-500 cursor-pointer">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-medium cursor-pointer">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

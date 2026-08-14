'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Home, MessageSquare, Users, Calendar, Folder, CheckSquare,
  Phone, BarChart3, Settings, Search, Plus, X, Send, Paperclip,
  Mic, MicOff, Video, VideoOff, Monitor, PhoneOff,
  PhoneIncoming, PhoneMissed, PhoneForwarded, Bell, MoreHorizontal,
  ChevronRight, Check, Trash2, Download, Upload, FolderPlus, Share2,
  FileText, UserPlus, Hash, Reply, Edit3, RefreshCw, Link2, Shield, Clock,
  Wifi, Globe, Volume2
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

const PRESENCE = {
  available: { dot: 'bg-emerald-400', text: 'Available' },
  busy:      { dot: 'bg-red-500',     text: 'Busy'      },
  away:      { dot: 'bg-amber-400',   text: 'Away'      },
  offline:   { dot: 'bg-slate-300',   text: 'Offline'   },
  dnd:       { dot: 'bg-red-600',     text: 'Do Not Disturb' },
  meeting:   { dot: 'bg-red-500',     text: 'In a Meeting'   },
};

const AVATAR_COLORS = {
  blue:   'from-blue-500 to-indigo-600',
  purple: 'from-teal-500 to-emerald-600',
  green:  'from-emerald-500 to-teal-600',
  orange: 'from-orange-500 to-amber-600',
  pink:   'from-pink-500 to-rose-600',
  teal:   'from-teal-500 to-cyan-600',
};

const PresenceDot = ({ status, size = 'sm' }) => {
  const p = PRESENCE[status] || PRESENCE.offline;
  const sz = size === 'lg' ? 'w-3.5 h-3.5 border-[2.5px]' : 'w-2.5 h-2.5 border-2';
  return <span className={cn('rounded-full border-white shrink-0 inline-block', sz, p.dot)} />;
};

const Avatar = ({ name, size = 'sm', color = 'blue' }) => {
  const sizeMap = { xs: 'w-6 h-6 text-[9px]', sm: 'w-8 h-8 text-[11px]', md: 'w-10 h-10 text-xs', lg: 'w-12 h-12 text-sm', xl: 'w-16 h-16 text-base' };
  const initials = (name || '?').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div className={cn('rounded-full bg-gradient-to-br text-white font-bold flex items-center justify-center shrink-0 shadow-sm', sizeMap[size], AVATAR_COLORS[color] || AVATAR_COLORS.blue)}>
      {initials}
    </div>
  );
};

const FileTypeIcon = ({ type }) => {
  const map = {
    excel:  { bg: 'bg-emerald-50', text: 'text-emerald-600', label: 'XLS' },
    ppt:    { bg: 'bg-orange-50',  text: 'text-orange-600',  label: 'PPT' },
    word:   { bg: 'bg-blue-50',    text: 'text-blue-600',    label: 'DOC' },
    pdf:    { bg: 'bg-red-50',     text: 'text-red-600',     label: 'PDF' },
    figma:  { bg: 'bg-purple-50',  text: 'text-purple-600',  label: 'FIG' },
    folder: { bg: 'bg-amber-50',   text: 'text-amber-500',   label: 'FLD' },
  };
  const f = map[type];
  if (!f) return <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center"><FileText size={16} className="text-slate-400" /></div>;
  return <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center font-black text-[11px]', f.bg, f.text)}>{f.label}</div>;
};

const Pill = ({ children, color = 'slate' }) => {
  const colors = { green: 'bg-emerald-50 text-emerald-700 border-emerald-200', red: 'bg-red-50 text-red-600 border-red-200', blue: 'bg-blue-50 text-blue-700 border-blue-200', slate: 'bg-slate-100 text-slate-500 border-slate-200' };
  return <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-bold border', colors[color])}>{children}</span>;
};

const GRAD = 'linear-gradient(135deg, #059669, #10b981)';
const GRAD2 = 'linear-gradient(135deg, #064e3b 0%, #047857 100%)';

const mockAccount = { connected: true, name: 'Abha Jatav', email: 'abha@uwo24.com', org: 'UWOConnect Inc.', connectedDate: 'August 1, 2026' };

const mockChats = [
  { id: 1, name: 'Sarah Mitchell', color: 'blue', status: 'available', lastMsg: 'Can you review the Q3 report?', time: '10:42 AM', unread: 2,
    msgs: [
      { id: 1, from: 'Sarah Mitchell', color: 'blue', fromMe: false, text: 'Hey, are you free for a quick call?', time: '10:30 AM' },
      { id: 2, from: 'Me', color: 'green', fromMe: true, text: 'Sure, give me 10 minutes!', time: '10:32 AM' },
      { id: 3, from: 'Sarah Mitchell', color: 'blue', fromMe: false, text: 'Can you review the Q3 report by EOD?', time: '10:42 AM' },
    ]},
  { id: 2, name: 'Dev Team', color: 'purple', status: null, lastMsg: 'Build passed on main', time: '9:15 AM', unread: 5,
    msgs: [
      { id: 1, from: 'Raj Kumar', color: 'purple', fromMe: false, text: 'CI pipeline running on PR #142...', time: '9:10 AM' },
      { id: 2, from: 'Priya S.', color: 'teal', fromMe: false, text: 'Build passed on main!', time: '9:15 AM' },
    ]},
  { id: 3, name: 'James Wilson', color: 'orange', status: 'busy', lastMsg: 'Meeting at 3pm confirmed', time: 'Yesterday', unread: 0,
    msgs: [{ id: 1, from: 'James Wilson', color: 'orange', fromMe: false, text: 'Meeting at 3pm confirmed', time: 'Yesterday' }]},
  { id: 4, name: 'Emma Thompson', color: 'teal', status: 'away', lastMsg: 'Thanks for the update!', time: 'Mon', unread: 0,
    msgs: [{ id: 1, from: 'Emma Thompson', color: 'teal', fromMe: false, text: 'Thanks for the update!', time: 'Mon' }]},
];

const mockTeams = [
  { id: 1, name: 'Engineering', color: 'purple', members: 12, channels: [
      { id: 1, name: 'general', unread: 3, msgs: [
          { id: 1, from: 'Raj Kumar', color: 'purple', text: 'Deployment scheduled for Friday evening.', time: '11:00 AM', replies: 4 },
          { id: 2, from: 'Priya S.', color: 'teal', text: 'Will run full QA pass before that.', time: '11:22 AM', replies: 2 },
      ]},
      { id: 2, name: 'bugs', unread: 0, msgs: [{ id: 1, from: 'DevBot', color: 'blue', text: 'Bug #342 assigned to @Raj', time: '9:00 AM', replies: 0 }] },
      { id: 3, name: 'deployments', unread: 1, msgs: [] },
  ]},
  { id: 2, name: 'Marketing', color: 'pink', members: 8, channels: [
      { id: 1, name: 'general', unread: 0, msgs: [{ id: 1, from: 'Anika Patel', color: 'pink', text: 'Q3 campaign is LIVE! Performance looks great.', time: '10:00 AM', replies: 6 }] },
      { id: 2, name: 'social-media', unread: 2, msgs: [] },
  ]},
  { id: 3, name: 'Sales', color: 'orange', members: 15, channels: [
      { id: 1, name: 'leads', unread: 0, msgs: [] },
      { id: 2, name: 'deals', unread: 0, msgs: [] },
  ]},
];

const mockMeetings = [
  { id: 1, title: 'Q3 Review Board', rawDate: '7', date: 'Today', time: '3:00 PM', tz: 'IST', participants: ['Sarah M.', 'James W.', 'Priya S.'], status: 'upcoming', agenda: 'Review quarterly KPIs and finalize Q4 OKRs.' },
  { id: 2, title: 'Engineering Standup', rawDate: '7', date: 'Today', time: '10:00 AM', tz: 'IST', participants: ['Raj K.', 'Priya S.'], status: 'past', agenda: 'Daily standup and blocker discussion.' },
  { id: 3, title: 'Client Onboarding Call', rawDate: '8', date: 'Tomorrow', time: '11:00 AM', tz: 'IST', participants: ['Emma T.', 'James W.'], status: 'upcoming', agenda: 'Walk through UWOConnect with client.' },
  { id: 4, title: 'Marketing Strategy Q4', rawDate: '10', date: 'Aug 10', time: '2:00 PM', tz: 'IST', participants: ['Anika P.', 'Sarah M.'], status: 'upcoming', agenda: 'Plan Q4 marketing campaigns.' },
];

const mockFiles = [
  { id: 1, name: 'Q3 Financial Report.xlsx', type: 'excel', size: '2.4 MB', modified: 'Today', owner: 'Sarah M.', shared: true, starred: true },
  { id: 2, name: 'Product Roadmap H2.pptx', type: 'ppt', size: '8.1 MB', modified: 'Yesterday', owner: 'Abha J.', shared: true, starred: false },
  { id: 3, name: 'Marketing Assets', type: 'folder', size: '---', modified: 'Aug 5', owner: 'Anika P.', shared: false, starred: false },
  { id: 4, name: 'API Documentation v3.docx', type: 'word', size: '1.2 MB', modified: 'Aug 4', owner: 'Raj K.', shared: false, starred: true },
  { id: 5, name: 'Design System 2026.figma', type: 'figma', size: '45 MB', modified: 'Aug 3', owner: 'Abha J.', shared: true, starred: false },
  { id: 6, name: 'Database Schema v2.pdf', type: 'pdf', size: '0.8 MB', modified: 'Aug 1', owner: 'Priya S.', shared: false, starred: false },
];

const mockTasks = [
  { id: 1, title: 'Review Q3 financial report', done: false, due: 'Today', priority: 'high', list: 'Work' },
  { id: 2, title: 'Update API documentation to v3', done: false, due: 'Aug 9', priority: 'medium', list: 'Work' },
  { id: 3, title: 'Send onboarding materials to Emma', done: true, due: 'Aug 7', priority: 'low', list: 'Work' },
  { id: 4, title: 'Schedule team retrospective', done: false, due: 'Today', priority: 'high', list: 'Meetings' },
  { id: 5, title: 'Review pull request 142', done: true, due: 'Aug 6', priority: 'medium', list: 'Dev' },
  { id: 6, title: 'Prepare Q4 budget proposal', done: false, due: 'Aug 12', priority: 'high', list: 'Finance' },
];

const mockCalls = [
  { id: 1, type: 'outgoing', with: 'Sarah Mitchell', color: 'blue', time: 'Today, 10:15 AM', duration: '12m 34s', video: false },
  { id: 2, type: 'missed', with: 'James Wilson', color: 'orange', time: 'Today, 9:02 AM', duration: '---', video: false },
  { id: 3, type: 'incoming', with: 'Dev Team', color: 'purple', time: 'Yesterday, 4:00 PM', duration: '45m 12s', video: true },
  { id: 4, type: 'outgoing', with: 'Emma Thompson', color: 'teal', time: 'Yesterday, 2:30 PM', duration: '8m 05s', video: false },
  { id: 5, type: 'missed', with: 'Anika Patel', color: 'pink', time: 'Aug 6, 11:00 AM', duration: '---', video: false },
];

const mockContacts = [
  { id: 1, name: 'Sarah Mitchell', dept: 'Product', status: 'available', color: 'blue' },
  { id: 2, name: 'James Wilson', dept: 'Sales', status: 'busy', color: 'orange' },
  { id: 3, name: 'Raj Kumar', dept: 'Engineering', status: 'available', color: 'purple' },
  { id: 4, name: 'Priya Singh', dept: 'Engineering', status: 'dnd', color: 'teal' },
  { id: 5, name: 'Anika Patel', dept: 'Marketing', status: 'away', color: 'pink' },
  { id: 6, name: 'Emma Thompson', dept: 'CS', status: 'offline', color: 'blue' },
];

const graphServices = [
  { name: 'Teams', icon: 'MS', connected: true },
  { name: 'Outlook', icon: 'OL', connected: true },
  { name: 'Calendar', icon: 'CA', connected: true },
  { name: 'OneDrive', icon: 'OD', connected: true },
  { name: 'SharePoint', icon: 'SP', connected: false },
  { name: 'Contacts', icon: 'CO', connected: true },
  { name: 'To Do', icon: 'TD', connected: true },
  { name: 'Planner', icon: 'PL', connected: false },
];

const NAV = [
  { id: 'overview', Icon: Home, label: 'Overview', badge: null },
  { id: 'chats', Icon: MessageSquare, label: 'Chat', badge: 7 },
  { id: 'channels', Icon: Hash, label: 'Teams', badge: 4 },
  { id: 'meetings', Icon: Calendar, label: 'Calendar', badge: null },
  { id: 'files', Icon: Folder, label: 'Files', badge: null },
  { id: 'tasks', Icon: CheckSquare, label: 'Tasks', badge: 3 },
  { id: 'calls', Icon: Phone, label: 'Calls', badge: 2 },
  { id: 'analytics', Icon: BarChart3, label: 'Analytics', badge: null },
  { id: 'settings', Icon: Settings, label: 'Settings', badge: null },
];

export default function TeamsPage() {
  const [section, setSection] = useState('overview');
  const [msConnected, setMsConn] = useState(mockAccount.connected);
  const [connecting, setConn] = useState(false);
  const [selChat, setSelChat] = useState(mockChats[0]);
  const [msgs, setMsgs] = useState(mockChats[0].msgs);
  const [chatInput, setChatInput] = useState('');
  const [searchChat, setSearchChat] = useState('');
  const [expanded, setExpanded] = useState({ 1: true });
  const [selCh, setSelCh] = useState({ team: mockTeams[0], ch: mockTeams[0].channels[0] });
  const [chInput, setChInput] = useState('');
  const [meetTab, setMeetTab] = useState('upcoming');
  const [showCreateMtg, setShowMtg] = useState(false);
  const [newMtg, setNewMtg] = useState({ title: '', date: '', time: '', participants: '' });
  const [fileSearch, setFileSearch] = useState('');
  const [fileSrc, setFileSrc] = useState('onedrive');
  const [taskTab, setTaskTab] = useState('todo');
  const [tasks, setTasks] = useState(mockTasks);
  const [newTask, setNewTask] = useState('');
  const [callFilter, setCallFilter] = useState('all');
  const [activeCall, setActiveCall] = useState(null);
  const [muted, setMuted] = useState(false);
  const [vidOff, setVidOff] = useState(false);
  const [onHold, setOnHold] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [perms, setPerms] = useState({ viewChats: true, sendMessages: true, createMeetings: true, joinMeetings: true, startCalls: true, videoCalls: true, screenShare: true, uploadFiles: true, downloadFiles: true, viewCalendar: true, manageTeams: false });
  const [toast, setToast] = useState(null);
  const [contactsList, setContactsList] = useState(mockContacts);
  const [eventsList, setEventsList] = useState(mockMeetings);
  const [iceServers, setIceServers] = useState([{ urls: 'stun:stun.l.google.com:19302' }]);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const streamRef = useRef(null);
  const pcRef = useRef(null);

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    return token ? { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } : { 'Content-Type': 'application/json' };
  };

  const fetchWebRTCConfig = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/webrtc/config/`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.ice_servers) {
          setIceServers(data.ice_servers);
        }
      }
    } catch (e) {}
  };

  const fetchStatus = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/outlook/status`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setMsConn(true);
        }
      }
    } catch (e) {}
  };

  const fetchBackendContacts = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/outlook/contacts`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.contacts && data.contacts.length > 0) {
          const mapped = data.contacts.map((c, i) => ({
            id: i + 1,
            name: c.displayName || 'Outlook Contact',
            dept: c.companyName || 'Microsoft 365',
            status: 'available',
            color: ['blue', 'purple', 'teal', 'orange', 'pink'][i % 5]
          }));
          setContactsList(mapped);
        }
      }
    } catch (e) {}
  };

  const fetchBackendEvents = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/outlook/calendar/events`, { headers: getHeaders() });
      if (res.ok) {
        const data = await res.json();
        if (data.events && data.events.length > 0) {
          const mapped = data.events.map((e, i) => ({
            id: i + 1,
            title: e.subject || 'Microsoft Meeting',
            rawDate: '7',
            date: 'Today',
            time: e.start?.dateTime ? new Date(e.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM',
            tz: 'UTC',
            participants: ['Team'],
            status: 'upcoming',
            agenda: e.bodyPreview || 'Scheduled via Outlook / Graph API'
          }));
          setEventsList(mapped);
        }
      }
    } catch (e) {}
  };

  useEffect(() => {
    fetchWebRTCConfig();
    fetchStatus();
    fetchBackendContacts();
    fetchBackendEvents();
  }, []);

  useEffect(() => {
    if (!activeCall) { setCallTimer(0); return; }
    const t = setInterval(() => setCallTimer(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [activeCall]);

  const fmtTimer = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const startCall = async (contact, video = false) => {
    const contactName = contact.name || contact;
    setActiveCall({ name: contactName, color: contact.color || 'blue', video });
    setMuted(false); setVidOff(false); setOnHold(false); setSharing(false);
    showToast(`Initializing WebRTC PeerConnection for ${contactName}...`);

    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: video ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false
        });
        streamRef.current = stream;

        const pc = new RTCPeerConnection({
          iceServers: iceServers.length > 0 ? iceServers : [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;

        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        setTimeout(() => {
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
        }, 100);

        showToast(`WebRTC Connected: Stream active (${video ? 'HD Video + Audio' : 'Audio'})`, 'success');
      }
    } catch (err) {
      console.warn('WebRTC getUserMedia fallback:', err);
      showToast('WebRTC active (simulated peer connection)', 'success');
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setActiveCall(null);
    showToast('WebRTC Call Ended: ' + fmtTimer(callTimer));
  };

  const toggleMute = () => {
    const nextState = !muted;
    setMuted(nextState);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !nextState; });
    }
    showToast(nextState ? 'Microphone Muted' : 'Microphone Active');
  };

  const toggleVideo = () => {
    const nextState = !vidOff;
    setVidOff(nextState);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = !nextState; });
    }
    showToast(nextState ? 'Camera Off' : 'Camera Active');
  };

  const toggleScreenShare = async () => {
    try {
      if (!sharing) {
        if (typeof window !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setSharing(true);
          showToast('WebRTC Screen Share Active!');
          screenStream.getVideoTracks()[0].onended = () => {
            setSharing(false);
            if (localVideoRef.current && streamRef.current) {
              localVideoRef.current.srcObject = streamRef.current;
            }
          };
        }
      } else {
        setSharing(false);
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
        showToast('Screen sharing stopped.');
      }
    } catch (err) {
      console.warn('Screen share cancelled:', err);
    }
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    setMsgs(p => [...p, { id: Date.now(), from: 'Me', color: 'green', fromMe: true, text: chatInput, time: 'Just now' }]);
    setChatInput('');
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks(p => [...p, { id: Date.now(), title: newTask, done: false, due: 'No due date', priority: 'medium', list: 'Work' }]);
    setNewTask('');
  };

  const permLabels = { viewChats: 'View Chats', sendMessages: 'Send Messages', createMeetings: 'Create Meetings', joinMeetings: 'Join Meetings', startCalls: 'Start Calls', videoCalls: 'Video Calls', screenShare: 'Screen Share', uploadFiles: 'Upload Files', downloadFiles: 'Download Files', viewCalendar: 'View Calendar', manageTeams: 'Manage Teams' };

  return (
    <DashboardLayout role="client">
      <div className="flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full overflow-hidden bg-[#f3f2f1] border-t border-slate-100">

        {toast && (
          <div className={cn('fixed top-4 right-6 z-[100] px-5 py-3 rounded-2xl shadow-2xl text-sm font-semibold flex items-center gap-2 transition-all', toast.type === 'success' ? 'bg-slate-900 text-white' : 'bg-red-600 text-white')}>
            {toast.msg}
          </div>
        )}

        {activeCall && (
          <div className="fixed bottom-6 right-6 z-[90] w-80 rounded-2xl overflow-hidden shadow-2xl border border-emerald-500/20" style={{ background: GRAD2 }}>
            <div className="relative h-44 flex flex-col items-center justify-center overflow-hidden bg-slate-950">
              {activeCall.video && !vidOff ? (
                <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 relative z-10">
                  <Avatar name={activeCall.name} size="lg" color={activeCall.color} />
                  <p className="text-white text-xs font-bold mt-1">{activeCall.name}</p>
                  <p className="text-emerald-300 text-[10px] flex items-center gap-1 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    WebRTC {onHold ? 'On Hold' : activeCall.video ? 'HD Video' : 'Audio Call'} • {fmtTimer(callTimer)}
                  </p>
                </div>
              )}
              {activeCall.video && !vidOff && (
                <div className="absolute top-2 left-2 z-20 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[9px] font-mono text-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  WebRTC Live • 60 FPS
                </div>
              )}
            </div>
            <div className="px-4 py-3 flex items-center justify-between gap-2 bg-[#064e3b]/95 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleMute}
                  title={muted ? 'Unmute' : 'Mute'}
                  className={cn('w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all', muted ? 'bg-red-500/90 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20')}
                >
                  {muted ? <MicOff size={14} /> : <Mic size={14} />}
                </button>
                <button
                  onClick={toggleVideo}
                  title={vidOff ? 'Start Video' : 'Stop Video'}
                  className={cn('w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all', vidOff ? 'bg-red-500/90 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20')}
                >
                  {vidOff ? <VideoOff size={14} /> : <Video size={14} />}
                </button>
                <button
                  onClick={toggleScreenShare}
                  title="Screen Share"
                  className={cn('w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-all', sharing ? 'bg-red-500/90 text-white' : 'bg-white/10 text-white/80 hover:bg-white/20')}
                >
                  <Monitor size={14} />
                </button>
              </div>
              <button onClick={endCall} title="End Call" className="w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center cursor-pointer transition-colors shadow-lg">
                <PhoneOff size={15} />
              </button>
            </div>
            <div className="bg-[#022c22] px-4 py-2 flex items-center justify-between text-xs border-t border-emerald-900/50">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1.5">
                  <Avatar name="Abha Jatav" size="xs" color="green" />
                  <Avatar name={activeCall.name} size="xs" color={activeCall.color} />
                </div>
                <span className="text-emerald-200 text-[10px]">2 Peer Connected</span>
              </div>
              <span className="text-[9px] font-mono text-emerald-400/80">Opus/VP8</span>
            </div>
          </div>
        )}

        {/* Top Horizontal Navigation Bar */}
        <div className="bg-white border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl text-white font-black text-xs flex items-center justify-center shadow-sm" style={{ background: GRAD }}>MS</div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-xs sm:text-sm tracking-tight leading-none">Microsoft Teams</h2>
              <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">Connected • Graph API</p>
            </div>
          </div>
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 custom-scrollbar">
            {NAV.map(({ id, Icon, label, badge }) => (
              <button
                key={id}
                onClick={() => setSection(id)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap",
                  section === id ? "bg-emerald-600 text-white shadow-xs" : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon size={14} />
                <span>{label}</span>
                {badge && (
                  <span className={cn("px-1.5 py-0.2 rounded-full text-[9px] font-black", section === id ? "bg-white text-emerald-700" : "bg-red-500 text-white")}>
                    {badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden bg-[#f3f2f1]">

          {section === 'overview' && (
            <div className="flex-1 overflow-y-auto">
              <div className="relative overflow-hidden" style={{ background: GRAD2 }}>
                <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 50%, white, transparent 60%)' }} />
                <div className="relative px-8 py-7 flex items-center justify-between">
                  <div className="text-white">
                    <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-bold tracking-wider">MICROSOFT 365</span>
                    <h1 className="text-2xl font-black mt-2">Microsoft Teams</h1>
                    <p className="text-emerald-200 text-sm mt-1">Enterprise collaboration powered by Graph API and Azure</p>
                    {msConnected && (
                      <div className="flex items-center gap-1.5 mt-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-emerald-300 text-xs font-semibold">Connected - {mockAccount.email}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-5xl opacity-20 select-none">MS</div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                {!msConnected ? (
                  <div className="max-w-lg mx-auto">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
                      <div className="h-1.5 w-full" style={{ background: GRAD }} />
                      <div className="p-8 text-center">
                        <h2 className="text-xl font-black text-slate-900">Connect Microsoft Account</h2>
                        <p className="text-slate-500 text-sm mt-2">Authenticate with Microsoft Entra ID to unlock Teams, Mail, Calendar, OneDrive and more.</p>
                        <div className="mt-5 space-y-2 text-left bg-slate-50 rounded-xl p-4">
                          {['Microsoft Teams - Chat, Channels and Meetings', 'Outlook Mail and Calendar Sync', 'OneDrive and SharePoint Files', 'Microsoft To Do and Planner Tasks', 'Azure Communication Services - Calls and Video'].map((item, i) => (
                            <div key={i} className="flex items-center gap-2.5 text-sm text-slate-700">
                              <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0"><Check size={10} className="text-emerald-600" /></div>
                              {item}
                            </div>
                          ))}
                        </div>
                        <button onClick={() => { setConn(true); setTimeout(() => { setConn(false); setMsConn(true); showToast('Microsoft account connected!'); }, 2000); }}
                          disabled={connecting} className="mt-6 w-full py-3 rounded-xl text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                          style={{ background: connecting ? '#059669aa' : GRAD }}>
                          {connecting ? (<><RefreshCw size={16} className="animate-spin" />Connecting...</>) : 'Sign in with Microsoft'}
                        </button>
                        <p className="text-[11px] text-slate-400 mt-3">Secured by OAuth 2.0 - Microsoft Entra ID</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-5">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Connected Account</h3>
                        <Pill color="green">Active</Pill>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl text-white text-xl font-black flex items-center justify-center shadow-lg" style={{ background: GRAD }}>A</div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{mockAccount.name}</p>
                          <p className="text-xs text-slate-500">{mockAccount.email}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{mockAccount.org}</p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                        <div className="flex justify-between text-slate-500"><span>Connected since</span><span className="font-medium text-slate-700">{mockAccount.connectedDate}</span></div>
                        <div className="flex justify-between text-slate-500"><span>Permissions</span><span className="font-medium text-emerald-600">6 scopes granted</span></div>
                        <div className="flex justify-between text-slate-500"><span>Token status</span><span className="font-medium text-emerald-600">Valid</span></div>
                      </div>
                      <button onClick={() => showToast('Account disconnected')} className="w-full py-2 rounded-xl text-xs font-semibold text-red-500 border border-red-100 hover:bg-red-50 cursor-pointer transition-colors">Disconnect Account</button>
                    </div>

                    <div className="col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Microsoft Graph Services</h3>
                        <button onClick={() => showToast('Syncing...')} className="flex items-center gap-1.5 text-[11px] text-emerald-600 font-semibold cursor-pointer hover:text-emerald-800"><RefreshCw size={11} /> Sync All</button>
                      </div>
                      <div className="grid grid-cols-4 gap-2.5">
                        {graphServices.map((svc, i) => (
                          <div key={i} className={cn('p-3 rounded-xl border flex flex-col items-center gap-2 text-center hover:shadow-sm transition-all', svc.connected ? 'border-emerald-200/80 bg-emerald-50/50' : 'border-slate-200 bg-slate-50')}>
                            <div className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-black text-white shadow-sm" style={{ background: svc.connected ? GRAD : '#94a3b8' }}>{svc.icon}</div>
                            <p className="text-[11px] font-bold text-slate-700 leading-tight">{svc.name}</p>
                            <Pill color={svc.connected ? 'green' : 'slate'}>{svc.connected ? 'On' : 'Off'}</Pill>
                          </div>
                        ))}
                      </div>
                    </div>

                    {[
                      { label: 'Unread Messages', value: '12', nav: 'chats', bg: 'bg-emerald-50', tc: 'text-emerald-600', Icon: MessageSquare },
                      { label: 'Upcoming Meetings', value: '3', nav: 'meetings', bg: 'bg-blue-50', tc: 'text-blue-600', Icon: Calendar },
                      { label: 'Pending Tasks', value: '4', nav: 'tasks', bg: 'bg-emerald-50', tc: 'text-emerald-600', Icon: CheckSquare },
                    ].map((s, i) => (
                      <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSection(s.nav)}>
                        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', s.bg)}><s.Icon size={18} className={s.tc} /></div>
                        <div>
                          <p className="text-xl font-black text-slate-900">{s.value}</p>
                          <p className="text-[11px] text-slate-400">{s.label}</p>
                        </div>
                      </div>
                    ))}

                    <div className="col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Microsoft Contacts</h3>
                        <button className="text-[11px] text-emerald-600 cursor-pointer font-semibold flex items-center gap-1"><UserPlus size={11} /> Add</button>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        {mockContacts.map(c => (
                          <div key={c.id} className="flex items-center gap-2.5 p-3 rounded-xl border border-transparent hover:border-slate-200 hover:bg-slate-50 group transition-all cursor-pointer">
                            <div className="relative">
                              <Avatar name={c.name} size="sm" color={c.color} />
                              <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={c.status} /></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[12px] font-bold text-slate-800 truncate">{c.name}</p>
                              <p className="text-[10px] text-slate-400">{c.dept}</p>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => startCall(c)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Phone size={12} /></button>
                              <button onClick={() => startCall(c, true)} className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Video size={12} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {section === 'chats' && (
            <div className="flex-1 flex overflow-hidden bg-white">
              <div className="w-72 border-r border-slate-100 flex flex-col shrink-0">
                <div className="px-4 py-3.5 border-b border-slate-100">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-black text-slate-900">Chat</h2>
                    <button onClick={() => showToast('New chat')} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Plus size={13} /></button>
                  </div>
                  <div className="relative">
                    <Search size={13} className="absolute left-3 top-[9px] text-slate-400" />
                    <input value={searchChat} onChange={e => setSearchChat(e.target.value)} placeholder="Search..." className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {mockChats.filter(c => c.name.toLowerCase().includes(searchChat.toLowerCase())).map(chat => (
                    <button key={chat.id} onClick={() => { setSelChat(chat); setMsgs(chat.msgs); }}
                      className={cn('w-full flex items-center gap-3 px-4 py-3 text-left border-b border-slate-50 relative cursor-pointer transition-all', selChat && selChat.id === chat.id ? 'bg-emerald-50' : 'hover:bg-slate-50')}>
                      {selChat && selChat.id === chat.id && <div className="absolute left-0 inset-y-1 w-0.5 rounded-full" style={{ background: GRAD }} />}
                      <div className="relative shrink-0">
                        <Avatar name={chat.name} size="sm" color={chat.color} />
                        {chat.status && <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={chat.status} /></div>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-0.5">
                          <span className={cn('text-[12px] truncate', chat.unread > 0 ? 'font-black text-slate-900' : 'font-semibold text-slate-700')}>{chat.name}</span>
                          <span className="text-[10px] text-slate-400 shrink-0 ml-2">{chat.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{chat.lastMsg}</p>
                      </div>
                      {chat.unread > 0 && <span className="w-5 h-5 rounded-full text-white text-[9px] font-black flex items-center justify-center shrink-0" style={{ background: GRAD }}>{chat.unread}</span>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 flex flex-col overflow-hidden">
                {selChat && (
                  <>
                    <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3 bg-white shadow-sm">
                      <div className="relative">
                        <Avatar name={selChat.name} size="sm" color={selChat.color} />
                        {selChat.status && <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={selChat.status} /></div>}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-slate-900">{selChat.name}</p>
                        <p className="text-[10px] text-slate-400">{selChat.status ? PRESENCE[selChat.status].text : 'Group'}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button onClick={() => startCall(selChat)} className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Phone size={15} /></button>
                        <button onClick={() => startCall(selChat, true)} className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 cursor-pointer"><Video size={15} /></button>
                        <button className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 cursor-pointer"><MoreHorizontal size={15} /></button>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 bg-[#fafafa]">
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-semibold">
                        <div className="flex-1 h-px bg-slate-200" />Today<div className="flex-1 h-px bg-slate-200" />
                      </div>
                      {msgs.map(msg => (
                        <div key={msg.id} className={cn('flex gap-2.5 group', msg.fromMe ? 'flex-row-reverse' : 'flex-row')}>
                          {!msg.fromMe && <div className="shrink-0 mt-1"><Avatar name={msg.from} size="xs" color={msg.color} /></div>}
                          <div className={cn('flex flex-col max-w-xs', msg.fromMe ? 'items-end' : 'items-start')}>
                            {!msg.fromMe && <span className="text-[10px] text-slate-400 font-semibold mb-1 ml-1">{msg.from}</span>}
                            <div className={cn('px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm', msg.fromMe ? 'text-white rounded-tr-sm' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm')}
                              style={msg.fromMe ? { background: GRAD } : {}}>
                              {msg.text}
                            </div>
                            <div className={cn('flex items-center gap-1.5 mt-1 mx-1', msg.fromMe ? 'flex-row-reverse' : 'flex-row')}>
                              <span className="text-[9px] text-slate-400">{msg.time}</span>
                              {msg.fromMe && <Check size={10} className="text-emerald-400" />}
                            </div>
                          </div>
                          <div className={cn('flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity self-center', msg.fromMe ? 'mr-2' : 'ml-2')}>
                            {['Like','Love','Ha'].map(e => <button key={e} className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer px-1">{e}</button>)}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-white border-t border-slate-100">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                        <button className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><Paperclip size={14} /></button>
                        <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendChat()}
                          placeholder={'Message ' + selChat.name + '...'} className="flex-1 bg-transparent text-xs text-slate-700 focus:outline-none placeholder:text-slate-400 py-1" />
                        <button onClick={sendChat} className="p-1.5 rounded-xl text-white cursor-pointer" style={{ background: chatInput.trim() ? GRAD : '#cbd5e1' }}>
                          <Send size={13} />
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {selChat && (
                <div className="w-52 border-l border-slate-100 p-4 bg-slate-50/50 flex flex-col gap-4 shrink-0 overflow-y-auto">
                  <div className="text-center py-3">
                    <div className="relative inline-block">
                      <Avatar name={selChat.name} size="md" color={selChat.color} />
                      {selChat.status && <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={selChat.status} size="lg" /></div>}
                    </div>
                    <p className="text-xs font-bold text-slate-800 mt-2">{selChat.name}</p>
                    {selChat.status && <p className="text-[10px] text-slate-400">{PRESENCE[selChat.status].text}</p>}
                  </div>
                  <div className="space-y-1">
                    <button onClick={() => startCall(selChat)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-slate-600 hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
                      <Phone size={12} className="text-slate-400" />Voice Call
                    </button>
                    <button onClick={() => startCall(selChat, true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-slate-600 hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
                      <Video size={12} className="text-slate-400" />Video Call
                    </button>
                    <button onClick={() => showToast('Coming soon')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] text-slate-600 hover:bg-white hover:shadow-sm cursor-pointer transition-all border border-transparent hover:border-slate-200">
                      <UserPlus size={12} className="text-slate-400" />Add to Group
                    </button>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Shared Files</p>
                    {[{ name: 'Q3 Report.xlsx', type: 'excel' }, { name: 'Roadmap.pptx', type: 'ppt' }].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 p-2 bg-white rounded-xl border border-slate-200 mb-1.5 cursor-pointer hover:shadow-sm transition-all">
                        <FileTypeIcon type={f.type} />
                        <span className="text-[10px] text-slate-600 truncate flex-1">{f.name}</span>
                        <Download size={11} className="text-slate-400 shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {section === 'channels' && (
            <div className="flex-1 flex overflow-hidden bg-white">
              <div className="w-64 border-r border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
                <div className="px-4 py-3.5 border-b border-slate-100 flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-900">Teams</h2>
                  <button onClick={() => showToast('Create team')} className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 cursor-pointer"><Plus size={13} /></button>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {mockTeams.map(team => (
                    <div key={team.id}>
                      <button onClick={() => setExpanded(p => ({ ...p, [team.id]: !p[team.id] }))}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                        <ChevronRight size={13} className={cn('text-slate-400 transition-transform', expanded[team.id] ? 'rotate-90' : '')} />
                        <span className="w-5 h-5 rounded-md text-white text-[8px] font-black flex items-center justify-center shrink-0" style={{ background: GRAD }}>{team.name.slice(0, 2).toUpperCase()}</span>
                        <span className="flex-1 text-left">{team.name}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{team.members}</span>
                      </button>
                      {expanded[team.id] && (
                        <div className="pl-8 pb-1">
                          {team.channels.map(ch => {
                            const active = selCh && selCh.ch.id === ch.id && selCh.team.id === team.id;
                            return (
                              <button key={ch.id} onClick={() => setSelCh({ team, ch })}
                                className={cn('w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-[11px] cursor-pointer transition-all mb-0.5', active ? 'bg-emerald-100 text-emerald-800 font-bold' : 'text-slate-600 hover:bg-slate-100 font-medium')}>
                                <Hash size={12} className={active ? 'text-emerald-500' : 'text-slate-400'} />
                                <span className="flex-1 text-left">{ch.name}</span>
                                {ch.unread > 0 && <span className="w-4 h-4 rounded-full text-white text-[8px] font-black flex items-center justify-center" style={{ background: GRAD }}>{ch.unread}</span>}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              {selCh && (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-2 bg-white shadow-sm">
                    <Hash size={15} className="text-slate-400" />
                    <span className="text-sm font-bold text-slate-900">{selCh.ch.name}</span>
                    <span className="text-slate-300 mx-1">-</span>
                    <span className="text-[12px] text-slate-500">{selCh.team.name}</span>
                    <div className="ml-auto">
                      <button onClick={() => showToast('Members')} className="px-3 py-1.5 rounded-xl text-[11px] font-semibold text-slate-500 hover:bg-slate-100 cursor-pointer flex items-center gap-1.5"><Users size={12} /> Members</button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 bg-[#fafafa]">
                    {selCh.ch.msgs.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 gap-3">
                        <Hash size={32} className="text-slate-200" />
                        <p className="text-sm font-semibold">No messages in #{selCh.ch.name}</p>
                        <p className="text-xs">Be the first to post!</p>
                      </div>
                    ) : selCh.ch.msgs.map(msg => (
                      <div key={msg.id} className="flex items-start gap-3 group">
                        <Avatar name={msg.from} size="sm" color={msg.color} />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-slate-900">{msg.from}</span>
                            <span className="text-[10px] text-slate-400">{msg.time}</span>
                          </div>
                          <div className="bg-white rounded-2xl rounded-tl-sm border border-slate-100 px-4 py-3 text-xs text-slate-700 leading-relaxed shadow-sm">{msg.text}</div>
                          <div className="flex items-center gap-2 mt-2">
                            {msg.replies > 0 && <button className="text-[11px] text-emerald-600 font-semibold cursor-pointer flex items-center gap-1"><Reply size={11} /> {msg.replies} replies</button>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 bg-white border-t border-slate-100">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-2xl border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                      <input value={chInput} onChange={e => setChInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { showToast('Sent to #' + selCh.ch.name); setChInput(''); }}}
                        placeholder={'Message #' + selCh.ch.name} className="flex-1 bg-transparent text-xs focus:outline-none placeholder:text-slate-400 py-1" />
                      <button onClick={() => { showToast('Sent!'); setChInput(''); }} className="p-1.5 rounded-xl text-white cursor-pointer" style={{ background: chInput.trim() ? GRAD : '#cbd5e1' }}>
                        <Send size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {section === 'meetings' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Meetings and Calendar</h2>
                  <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" /> Synced with Outlook Calendar</p>
                </div>
                <button onClick={() => setShowMtg(true)} className="px-4 py-2.5 rounded-xl text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md" style={{ background: GRAD }}>
                  <Plus size={14} /> New Meeting
                </button>
              </div>

              {showCreateMtg && (
                <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
                    <div className="h-1.5 w-full" style={{ background: GRAD }} />
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Calendar size={15} className="text-emerald-600" /> Schedule Teams Meeting</h3>
                      <button onClick={() => setShowMtg(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer"><X size={15} /></button>
                    </div>
                    <div className="p-6 space-y-4">
                      {[{ l: 'Title', k: 'title', t: 'text', p: 'e.g. Q3 Strategy Review' }, { l: 'Date', k: 'date', t: 'date', p: '' }, { l: 'Time', k: 'time', t: 'time', p: '' }, { l: 'Participants', k: 'participants', t: 'text', p: 'email@domain.com' }].map(f => (
                        <div key={f.k}>
                          <label className="block text-[11px] font-bold text-slate-500 mb-1.5 uppercase tracking-wide">{f.l}</label>
                          <input type={f.t} placeholder={f.p} value={newMtg[f.k]} onChange={e => setNewMtg(p => ({ ...p, [f.k]: e.target.value }))} className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all" />
                        </div>
                      ))}
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => setShowMtg(false)} className="flex-1 py-2.5 text-xs font-semibold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-50 cursor-pointer">Cancel</button>
                        <button onClick={() => { setShowMtg(false); showToast('Meeting created!'); }} className="flex-1 py-2.5 text-white text-xs font-bold rounded-xl cursor-pointer" style={{ background: GRAD }}>Create Meeting</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit">
                {['upcoming', 'today', 'past'].map(t => (
                  <button key={t} onClick={() => setMeetTab(t)} className={cn('px-4 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer', meetTab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>
                    {t === 'today' ? "Today's" : t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {mockMeetings.filter(m => meetTab === 'today' ? m.date === 'Today' : meetTab === 'past' ? m.status === 'past' : m.status === 'upcoming').map(mtg => (
                  <div key={mtg.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-1 w-full" style={{ background: GRAD }} />
                    <div className="p-5 flex items-start gap-4">
                      <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-sm shrink-0 shadow-sm" style={{ background: GRAD }}>{mtg.rawDate}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900">{mtg.title}</h4>
                            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5"><Clock size={11} /> {mtg.date} - {mtg.time} {mtg.tz}</p>
                            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                              {mtg.participants.slice(0, 3).map((p, i) => <span key={i} className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-full text-slate-600 font-medium">{p}</span>)}
                            </div>
                            {mtg.agenda && <p className="text-[11px] text-slate-400 mt-1.5 italic">"{mtg.agenda}"</p>}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <Pill color={mtg.status === 'upcoming' ? 'blue' : 'slate'}>{mtg.status}</Pill>
                            {mtg.status === 'upcoming' && (
                              <div className="flex gap-1">
                                <button onClick={() => showToast('RSVP: Accepted')} className="px-2 py-1 text-[10px] font-bold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer">Accept</button>
                                <button onClick={() => showToast('RSVP: Declined')} className="px-2 py-1 text-[10px] font-bold rounded-lg bg-red-50 text-red-600 border border-red-200 cursor-pointer">Decline</button>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <button className="px-3.5 py-2 text-white text-[11px] font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm" style={{ background: GRAD }}>
                            <Video size={12} /> Join
                          </button>
                          <button onClick={() => showToast('Edit')} className="px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"><Edit3 size={11} /> Edit</button>
                          <button onClick={() => showToast('Link copied!')} className="px-3 py-2 text-xs text-slate-600 border border-slate-200 rounded-xl flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"><Link2 size={11} /> Copy Link</button>
                          <button onClick={() => showToast('Cancelled')} className="px-3 py-2 text-xs text-red-500 border border-red-200 rounded-xl flex items-center gap-1.5 hover:bg-red-50 cursor-pointer ml-auto"><X size={11} /> Cancel</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {section === 'files' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-black text-slate-900">Files</h2><p className="text-xs text-slate-500 mt-0.5">OneDrive and SharePoint</p></div>
                <div className="flex items-center gap-2">
                  <button onClick={() => showToast('Upload')} className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"><Upload size={13} /> Upload</button>
                  <button onClick={() => showToast('Folder created')} className="px-3 py-2 border border-slate-200 text-slate-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 hover:bg-slate-50 cursor-pointer"><FolderPlus size={13} /> New Folder</button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[{ id: 'onedrive', label: 'OneDrive' }, { id: 'sharepoint', label: 'SharePoint' }].map(s => (
                    <button key={s.id} onClick={() => setFileSrc(s.id)} className={cn('px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer', fileSrc === s.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>{s.label}</button>
                  ))}
                </div>
                <div className="relative flex-1 max-w-xs">
                  <Search size={13} className="absolute left-3 top-2 text-slate-400" />
                  <input value={fileSearch} onChange={e => setFileSearch(e.target.value)} placeholder="Search files..." className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all" />
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-[44px_1fr_100px_80px_100px_80px] text-[10px] font-black text-slate-400 uppercase tracking-wider px-5 py-3 border-b border-slate-100 bg-slate-50">
                  <div /><div>Name</div><div className="text-center">Modified</div><div className="text-center">Size</div><div className="text-center">Owner</div><div className="text-center">Actions</div>
                </div>
                {mockFiles.filter(f => f.name.toLowerCase().includes(fileSearch.toLowerCase())).map(file => (
                  <div key={file.id} className="grid grid-cols-[44px_1fr_100px_80px_100px_80px] items-center px-5 py-3 border-b border-slate-50 hover:bg-slate-50 group transition-colors cursor-pointer">
                    <div><FileTypeIcon type={file.type} /></div>
                    <div className="min-w-0 pl-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-semibold text-slate-800 truncate">{file.name}</p>
                        {file.shared && <span className="text-[9px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded-full font-bold border border-blue-100 shrink-0">Shared</span>}
                      </div>
                    </div>
                    <div className="text-center text-[11px] text-slate-400">{file.modified}</div>
                    <div className="text-center text-[11px] text-slate-400">{file.size}</div>
                    <div className="text-center text-[11px] text-slate-500 font-medium">{file.owner}</div>
                    <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => showToast('Downloading...')} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"><Download size={12} /></button>
                      <button onClick={() => showToast('Link copied!')} className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg cursor-pointer"><Share2 size={12} /></button>
                      <button onClick={() => showToast('Deleted')} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"><Trash2 size={12} /></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold text-slate-700">OneDrive Storage</h3>
                  <span className="text-xs text-slate-500">58.2 GB / 1 TB</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '6%', background: GRAD }} />
                </div>
                <p className="text-[10px] text-slate-400 mt-1.5">6% used - 941.8 GB free</p>
              </div>
            </div>
          )}

          {section === 'tasks' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div><h2 className="text-lg font-black text-slate-900">Tasks</h2><p className="text-xs text-slate-500 mt-0.5">Microsoft To Do and Planner</p></div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl w-fit">
                {[{ id: 'todo', l: 'My Tasks' }, { id: 'today', l: 'Due Today' }, { id: 'planner', l: 'Planner' }].map(t => (
                  <button key={t.id} onClick={() => setTaskTab(t.id)} className={cn('px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer', taskTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700')}>{t.l}</button>
                ))}
              </div>

              {taskTab !== 'planner' ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 max-w-2xl space-y-2">
                  <div className="flex items-center gap-3 pb-3 border-b border-slate-100 mb-1">
                    <div className="w-5 h-5 rounded-md border-2 border-dashed border-slate-300 shrink-0" />
                    <input value={newTask} onChange={e => setNewTask(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()}
                      placeholder="Add a task, press Enter..." className="flex-1 text-xs text-slate-700 focus:outline-none placeholder:text-slate-400" />
                    {newTask && <button onClick={addTask} className="px-3 py-1.5 text-[11px] font-bold text-white rounded-lg cursor-pointer" style={{ background: GRAD }}>Add</button>}
                  </div>
                  {tasks.filter(t => taskTab === 'today' ? t.due === 'Today' : true).map(task => (
                    <div key={task.id} className={cn('flex items-center gap-3 py-2 group rounded-xl px-2 hover:bg-slate-50 transition-colors', task.done ? 'opacity-50' : '')}>
                      <button onClick={() => setTasks(p => p.map(t => t.id === task.id ? { ...t, done: !t.done } : t))}
                        className={cn('w-5 h-5 rounded-md border-2 flex items-center justify-center cursor-pointer transition-all shrink-0', task.done ? 'border-emerald-500' : 'border-slate-300 hover:border-emerald-500')}
                        style={task.done ? { background: GRAD } : {}}>
                        {task.done && <Check size={11} className="text-white" />}
                      </button>
                      <span className={cn('flex-1 text-xs', task.done ? 'line-through text-slate-400' : 'text-slate-800')}>{task.title}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={cn('px-1.5 py-0.5 rounded-md text-[9px] font-black', task.priority === 'high' ? 'bg-red-50 text-red-500 border border-red-100' : task.priority === 'medium' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' : 'bg-slate-100 text-slate-400')}>{task.priority}</span>
                        <span className={cn('text-[10px] font-semibold', task.due === 'Today' ? 'text-red-500' : 'text-slate-400')}>{task.due}</span>
                        <button onClick={() => setTasks(p => p.filter(t => t.id !== task.id))} className="p-1 text-slate-200 hover:text-red-400 cursor-pointer opacity-0 group-hover:opacity-100"><Trash2 size={11} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 max-w-4xl">
                  {[
                    { bucket: 'To Do', items: ['Design new dashboard UI', 'Review API docs', 'Setup ACS SDK'] },
                    { bucket: 'In Progress', items: ['Q3 reporting module', 'Teams integration UI', 'CRM pipeline view'] },
                    { bucket: 'Completed', items: ['Auth system v2', 'Email module overhaul', 'CRM leads page', 'Sidebar collapse'] },
                  ].map(b => (
                    <div key={b.bucket} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                      <div className="h-1.5 w-full" style={{ background: GRAD }} />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-xs font-black text-slate-800">{b.bucket}</h4>
                          <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold flex items-center justify-center">{b.items.length}</span>
                        </div>
                        <div className="space-y-2">
                          {b.items.map((t, i) => (
                            <div key={i} className="px-3 py-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-700 cursor-pointer hover:bg-white hover:shadow-sm transition-all">{t}</div>
                          ))}
                          <button onClick={() => showToast('Add task')} className="w-full py-2 text-[11px] text-slate-400 hover:text-slate-600 flex items-center gap-1 cursor-pointer"><Plus size={11} /> Add task</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {section === 'calls' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Calls</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Voice, HD Video & Screen Sharing</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => startCall({ name: 'New Call', color: 'blue' })} className="px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md" style={{ background: 'linear-gradient(135deg, #16a34a, #059669)' }}>
                    <Phone size={13} /> Voice Call
                  </button>
                  <button onClick={() => startCall({ name: 'Video Call', color: 'purple' }, true)} className="px-4 py-2 rounded-xl text-white text-xs font-bold cursor-pointer flex items-center gap-1.5 shadow-md" style={{ background: GRAD }}>
                    <Video size={13} /> Video Call
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">Quick Dial</h3>
                <div className="grid grid-cols-3 gap-3">
                  {mockContacts.map(c => (
                    <div key={c.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-slate-50 hover:bg-white hover:shadow-sm group transition-all cursor-pointer">
                      <div className="relative">
                        <Avatar name={c.name} size="sm" color={c.color} />
                        <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={c.status} /></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-slate-800 truncate">{c.name}</p>
                        <p className="text-[10px] text-slate-400">{PRESENCE[c.status] ? PRESENCE[c.status].text : ''}</p>
                      </div>
                      <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => startCall(c)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 cursor-pointer" title="WebRTC Audio Call"><Phone size={12} /></button>
                        <button onClick={() => startCall(c, true)} className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 cursor-pointer" title="WebRTC Video Call"><Video size={12} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100 flex items-center gap-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex-1">Call History</h3>
                  <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg">
                    {['all', 'missed', 'incoming', 'outgoing'].map(t => (
                      <button key={t} onClick={() => setCallFilter(t)} className={cn('px-2.5 py-1 rounded-md text-[10px] font-bold capitalize cursor-pointer transition-all', callFilter === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600')}>{t}</button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-slate-50">
                  {mockCalls.filter(c => callFilter === 'all' || c.type === callFilter).map(call => {
                    const TypeIcon = call.type === 'outgoing' ? PhoneForwarded : call.type === 'incoming' ? PhoneIncoming : PhoneMissed;
                    const iconCls = call.type === 'outgoing' ? 'text-emerald-600 bg-emerald-50' : call.type === 'incoming' ? 'text-blue-600 bg-blue-50' : 'text-red-500 bg-red-50';
                    return (
                      <div key={call.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-slate-50 group transition-colors">
                        <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', iconCls)}><TypeIcon size={14} /></div>
                        <Avatar name={call.with} size="sm" color={call.color} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-[12px] font-bold text-slate-800">{call.with}</p>
                            {call.video && <span className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full font-bold border border-emerald-100">Video</span>}
                            {call.type === 'missed' && <span className="text-[9px] px-1.5 py-0.5 bg-red-50 text-red-500 rounded-full font-bold border border-red-100">Missed</span>}
                          </div>
                          <p className="text-[10px] text-slate-400">{call.time} - {call.duration}</p>
                        </div>
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => startCall({ name: call.with, color: call.color })} className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 cursor-pointer" title="Call via WebRTC"><Phone size={13} /></button>
                          <button onClick={() => startCall({ name: call.with, color: call.color }, true)} className="p-2 rounded-xl text-emerald-600 hover:bg-emerald-50 cursor-pointer" title="Video Call via WebRTC"><Video size={13} /></button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-100 overflow-hidden" style={{ background: 'linear-gradient(135deg, #eef2ff, #f0fdf4)' }}>
                <div className="p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl text-white text-[10px] font-black flex items-center justify-center shrink-0 shadow" style={{ background: GRAD }}>RTC</div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800">WebRTC Peer Connection Engine</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">Direct browser-to-browser real-time communication using RTCPeerConnection with STUN server discovery. Features live microphone audio capture, local HD camera stream, screen sharing, and latency tracking.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {section === 'analytics' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div><h2 className="text-lg font-black text-slate-900">Teams Analytics</h2><p className="text-xs text-slate-500 mt-0.5">Communication metrics - Last 30 days</p></div>
                <button onClick={() => showToast('Report exported!')} className="px-3.5 py-2 border border-slate-200 text-xs font-semibold text-slate-600 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center gap-1.5"><Download size={13} /> Export</button>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Meetings Created', value: '34', delta: '+12%', grad: 'from-emerald-500 to-teal-600', Icon: Calendar },
                  { label: 'Calls Made', value: '128', delta: '+8%', grad: 'from-emerald-500 to-teal-600', Icon: Phone },
                  { label: 'Call Duration', value: '46h', delta: '+5%', grad: 'from-blue-500 to-cyan-600', Icon: Clock },
                  { label: 'Messages Sent', value: '1.2K', delta: '+23%', grad: 'from-purple-500 to-pink-600', Icon: MessageSquare },
                  { label: 'Files Shared', value: '89', delta: '+4%', grad: 'from-orange-500 to-amber-600', Icon: Share2 },
                  { label: 'Active Users', value: '24', delta: '+3', grad: 'from-emerald-600 to-teal-700', Icon: Users },
                  { label: 'Missed Calls', value: '7', delta: '-15%', grad: 'from-red-500 to-rose-600', Icon: PhoneMissed },
                  { label: 'Avg Response', value: '8 min', delta: '-2m', grad: 'from-teal-500 to-emerald-600', Icon: RefreshCw },
                ].map((s, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                      <div className={cn('w-9 h-9 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm', s.grad)}>
                        <s.Icon size={16} />
                      </div>
                      <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', s.delta.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500')}>{s.delta}</span>
                    </div>
                    <p className="text-xl font-black text-slate-900">{s.value}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-5">Weekly Activity</h3>
                <div className="flex items-end justify-between gap-2 h-28">
                  {[['Mon', 65], ['Tue', 82], ['Wed', 45], ['Thu', 90], ['Fri', 72], ['Sat', 30], ['Sun', 20]].map(([day, h]) => (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full rounded-t-lg hover:opacity-80 cursor-pointer transition-opacity" style={{ height: h + '%', background: GRAD }} />
                      <span className="text-[10px] text-slate-400 font-semibold">{day}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-5 py-3.5 border-b border-slate-100">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Employee Activity</h3>
                </div>
                <div>
                  <div className="grid grid-cols-5 text-[10px] font-black text-slate-400 uppercase tracking-wider px-5 py-2.5 border-b border-slate-100 bg-slate-50">
                    {['Employee', 'Calls', 'Messages', 'Meetings', 'Avg Response'].map(h => <div key={h}>{h}</div>)}
                  </div>
                  {mockContacts.map((c, idx) => {
                    const stats = [[28, 186, 12, '4 min'], [15, 92, 8, '11 min'], [42, 234, 18, '3 min'], [31, 178, 14, '6 min'], [19, 145, 7, '9 min'], [11, 64, 5, '15 min']];
                    const row = stats[idx] || [10, 50, 4, '8 min'];
                    return (
                      <div key={c.id} className="grid grid-cols-5 px-5 py-3 border-b border-slate-50 hover:bg-slate-50 transition-colors items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="relative">
                            <Avatar name={c.name} size="xs" color={c.color} />
                            <div className="absolute -bottom-0.5 -right-0.5"><PresenceDot status={c.status} /></div>
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-slate-800">{c.name}</p>
                            <p className="text-[9px] text-slate-400">{c.dept}</p>
                          </div>
                        </div>
                        {row.map((n, i) => <div key={i} className="text-xs text-slate-600 font-medium">{n}</div>)}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {section === 'settings' && (
            <div className="flex-1 overflow-y-auto p-6 space-y-5 max-w-3xl">
              <div><h2 className="text-lg font-black text-slate-900">Settings and Permissions</h2><p className="text-xs text-slate-500 mt-0.5">Configure Azure credentials, permissions and notifications.</p></div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="h-1 w-full" style={{ background: GRAD }} />
                <div className="p-5">
                  <h3 className="text-sm font-black text-slate-800 mb-1">Azure App Registration</h3>
                  <p className="text-xs text-slate-500 mb-4">Configure Microsoft Entra ID app credentials to enable real API calls.</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ l: 'Tenant ID', p: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { l: 'Client ID', p: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' }, { l: 'Client Secret', p: 'Client secret value' }, { l: 'Redirect URI', p: 'https://app.uwoconnect.com/auth/microsoft' }].map(f => (
                      <div key={f.l}>
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-1.5">{f.l}</label>
                        <input placeholder={f.p} className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono bg-slate-50 transition-all" />
                      </div>
                    ))}
                    <div className="col-span-2">
                      <label className="block text-[11px] font-black text-slate-400 uppercase tracking-wide mb-1.5">ACS Connection String</label>
                      <input placeholder="endpoint=https://your-resource.communication.azure.com/;accesskey=..." className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 font-mono bg-slate-50 transition-all" />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <button onClick={() => showToast('Azure credentials saved!')} className="px-5 py-2.5 text-white text-xs font-black rounded-xl cursor-pointer shadow-md" style={{ background: GRAD }}>Save Credentials</button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-black text-slate-800 mb-1 flex items-center gap-2"><Shield size={15} className="text-emerald-600" /> User Permissions</h3>
                <p className="text-xs text-slate-500 mb-4">Control what users can access in the Teams integration.</p>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(perms).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <span className="text-xs font-semibold text-slate-700">{permLabels[key]}</span>
                      <button onClick={() => setPerms(p => ({ ...p, [key]: !p[key] }))}
                        className="w-10 h-[22px] rounded-full transition-all cursor-pointer relative"
                        style={{ background: val ? GRAD : '#e2e8f0' }}>
                        <div className={cn('w-4 h-4 bg-white rounded-full absolute top-[3px] shadow-sm transition-all', val ? 'left-[22px]' : 'left-[3px]')} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button onClick={() => showToast('Permissions saved!')} className="px-5 py-2.5 text-white text-xs font-black rounded-xl cursor-pointer shadow-md" style={{ background: GRAD }}>Save Permissions</button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-black text-slate-800 mb-4 flex items-center gap-2"><Bell size={15} className="text-emerald-600" /> Notifications</h3>
                <div className="space-y-1">
                  {['Incoming Call', 'Missed Call', 'Meeting Reminder (15 min)', 'Meeting Started', 'New Teams Message', 'File Shared', 'New Channel Mention'].map(n => (
                    <div key={n} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <span className="text-xs text-slate-700 font-medium">{n}</span>
                      <button className="w-10 h-[22px] rounded-full relative cursor-pointer" style={{ background: GRAD }}>
                        <div className="w-4 h-4 bg-white rounded-full absolute top-[3px] left-[22px] shadow-sm" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

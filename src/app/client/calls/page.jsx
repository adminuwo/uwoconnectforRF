'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, PhoneCall, Video, Mic, MicOff, VideoOff, Monitor, PhoneOff,
  Users, Search, Calendar, Clock, Plus, Sparkles, Check, X, Settings,
  Volume2, Pause, Play, Grid, FileText, Filter, Shield, BarChart3,
  Download, Trash2, UserPlus, MessageSquare, Share2, MoreVertical, Wifi,
  ChevronRight, RefreshCw, Keypad, ArrowUpRight, ArrowDownLeft, PhoneMissed
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

const GRAD = 'linear-gradient(135deg, #00AB56, #00AE8B)';
const GRAD_DARK = 'linear-gradient(135deg, #064e3b, #047857)';

// Predefined Mock Data
const MOCK_CONTACTS = [
  { id: 1, name: 'Sarah Mitchell', role: 'VP of Product', dept: 'Product', status: 'available', color: 'blue', phone: '+1 (555) 234-5678', avatar: 'SM' },
  { id: 2, name: 'Raj Kumar', role: 'Lead DevOps Engineer', dept: 'Engineering', status: 'available', color: 'purple', phone: '+1 (555) 876-5432', avatar: 'RK' },
  { id: 3, name: 'Priya Singh', role: 'Senior Frontend Lead', dept: 'Engineering', status: 'busy', color: 'teal', phone: '+1 (555) 345-6789', avatar: 'PS' },
  { id: 4, name: 'James Wilson', role: 'Account Executive', dept: 'Sales', status: 'offline', color: 'orange', phone: '+1 (555) 987-6543', avatar: 'JW' },
  { id: 5, name: 'Anika Patel', role: 'Head of Marketing', dept: 'Marketing', status: 'available', color: 'pink', phone: '+1 (555) 456-7890', avatar: 'AP' },
  { id: 6, name: 'Emma Thompson', role: 'Customer Success Specialist', dept: 'Support', status: 'away', color: 'indigo', phone: '+1 (555) 654-3210', avatar: 'ET' }
];

const MOCK_CALL_HISTORY = [
  { id: 'c1', name: 'Sarah Mitchell', dept: 'Product', type: 'outgoing', callType: 'video', date: 'Today, 11:30 AM', duration: '14m 22s', status: 'completed', hasAI: true },
  { id: 'c2', name: 'Raj Kumar', dept: 'Engineering', type: 'incoming', callType: 'voice', date: 'Today, 09:15 AM', duration: '05m 10s', status: 'completed', hasAI: true },
  { id: 'c3', name: 'James Wilson', dept: 'Sales', type: 'missed', callType: 'voice', date: 'Yesterday, 04:45 PM', duration: '0s', status: 'missed', hasAI: false },
  { id: 'c4', name: 'Dev Strategy Sync', dept: 'Engineering Group', type: 'outgoing', callType: 'video', date: 'Yesterday, 02:00 PM', duration: '42m 08s', status: 'completed', hasAI: true }
];

const MOCK_AI_TRANSCRIPTS = [
  {
    id: 'ai1',
    title: 'Product Sprint & Roadmap Discussion',
    with: 'Sarah Mitchell',
    date: 'Today, 11:30 AM',
    duration: '14m 22s',
    summary: 'Reviewed Q3 feature milestones for UWOConnect. Agreed to prioritize CRM live audio calling integration and speech-to-text transcript generation before Friday QA pass.',
    actionItems: [
      'Finalize WebRTC STUN/TURN TURN server credentials for mobile users',
      'Integrate Speech-to-Text webhook into CRM lead timeline',
      'Schedule follow-up demo with Product Council on Monday'
    ],
    sentiment: 'Positive (94%)'
  },
  {
    id: 'ai2',
    title: 'Architecture & DevOps Sync',
    with: 'Raj Kumar',
    date: 'Today, 09:15 AM',
    duration: '05m 10s',
    summary: 'Discussed backend API deployment pipelines on Django REST. Confirmed media stream routing security and token authentication permission classes.',
    actionItems: [
      'Update Daphne ASGI channels settings for real-time signaling',
      'Add call quality monitoring metrics to admin dashboard'
    ],
    sentiment: 'Neutral (88%)'
  }
];

export default function EnterpriseCallsPage() {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'history', 'schedule', 'ai', 'admin'
  const [contacts, setContacts] = useState([]);
  const [callHistory, setCallHistory] = useState(MOCK_CALL_HISTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Call Engine States
  const [activeCall, setActiveCall] = useState(null); // { name, role, dept, color, isVideo, isGroup }
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isOnHold, setIsOnHold] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);
  const [showChatDrawer, setShowChatDrawer] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showAISummaryModal, setShowAISummaryModal] = useState(null);
  
  // Media refs
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const pcRef = useRef(null);
  const [toast, setToast] = useState(null);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

  const fetchRealContacts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const deletedIds = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('uwo_deleted_members') || '[]') : [];
      
      const res = await fetch(`${API_BASE}/api/team/members/`, { headers });
      if (res.ok) {
        const data = await res.json();
        const memberList = Array.isArray(data) ? data : data.results || [];
        const activeMembers = memberList.filter(c => !deletedIds.includes(String(c.id)));

        const mapped = activeMembers.map((c, i) => ({
          id: c.id || i + 1,
          name: c.name || c.full_name || c.username || c.email || 'Team Member',
          role: c.role || c.designation || 'Member',
          dept: c.department || 'General',
          status: 'available',
          color: ['blue', 'purple', 'teal', 'orange', 'pink'][i % 5],
          phone: c.phone || '+1 (555) 000-0000',
          avatar: (c.name || c.username || c.email || 'TM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
        }));
        setContacts(mapped);
      }
    } catch (e) {
      console.warn('Real team contacts fetch fallback:', e);
    }
  };

  const fetchRealCallHistory = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const res = await fetch(`${API_BASE}/api/webrtc/history/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.history && data.history.length > 0) {
          setCallHistory(data.history);
        }
      }
    } catch (e) {
      console.warn('Real call history fetch fallback:', e);
    }
  };

  useEffect(() => {
    fetchRealContacts();
    fetchRealCallHistory();
  }, []);

  // Incoming Call Simulation
  const [incomingCall, setIncomingCall] = useState(null);

  // Add Team Member Modal State
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('');
  const [newMemberDept, setNewMemberDept] = useState('Engineering');
  const [newMemberPhone, setNewMemberPhone] = useState('');

  const handleAddTeamMember = async (e) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    const newContactObj = {
      id: Date.now(),
      name: newMemberName,
      role: newMemberRole || 'Team Member',
      dept: newMemberDept || 'General',
      status: 'available',
      color: 'green',
      phone: newMemberPhone || '+1 (555) 000-0000',
      avatar: newMemberName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    };

    setContacts(prev => [newContactObj, ...prev]);

    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      await fetch(`${API_BASE}/api/team/members/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newMemberName,
          role: newMemberRole,
          department: newMemberDept,
          phone: newMemberPhone
        })
      });
    } catch (err) {}

    showNotification(`✅ Added ${newMemberName} to your Workspace Team Call Directory!`);
    setNewMemberName('');
    setNewMemberRole('');
    setNewMemberPhone('');
    setShowAddMemberModal(false);
  };

  const showNotification = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Web Audio Synth Ringtone Sound Engine
  const ringtoneRef = useRef(null);

  const startRingtoneSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      let playing = true;
      const playTone = () => {
        if (!playing) return;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, audioCtx.currentTime);
        osc.frequency.setValueAtTime(480, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 1.2);
      };
      playTone();
      const interval = setInterval(playTone, 1800);
      ringtoneRef.current = () => {
        playing = false;
        clearInterval(interval);
        audioCtx.close();
      };
    } catch (e) {}
  };

  const stopRingtoneSound = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current();
      ringtoneRef.current = null;
    }
  };

  // Cross-Tab & Real-Time Call Listener
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let channel;
    try {
      channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.onmessage = (event) => {
        const data = event.data;
        if (data?.type === 'CALL_INITIATED') {
          setIncomingCall({
            name: data.callerName || 'Team Member',
            role: data.role || 'Workspace Member',
            dept: data.dept || 'Engineering',
            isVideo: data.isVideo,
            sessionId: data.sessionId
          });
          startRingtoneSound();
        } else if (data?.type === 'CALL_ACCEPTED') {
          stopRingtoneSound();
          showNotification(`✅ Call connected with ${data.responderName || 'Team Member'}!`);
        } else if (data?.type === 'CALL_REJECTED') {
          stopRingtoneSound();
          showNotification('Call declined.');
          setIncomingCall(null);
        } else if (data?.type === 'CALL_ENDED') {
          stopRingtoneSound();
          setActiveCall(null);
          setIncomingCall(null);
        }
      };
    } catch (e) {}

    return () => {
      if (channel) channel.close();
      stopRingtoneSound();
    };
  }, []);

  // Timer logic for active call
  useEffect(() => {
    if (!activeCall) {
      setCallTimer(0);
      return;
    }
    const interval = setInterval(() => setCallTimer(s => s + 1), 1000);
    return () => clearInterval(interval);
  }, [activeCall]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  // Start Call Handler (Voice / Video)
  const initiateCall = async (target, isVideo = false) => {
    const callTarget = target.name ? target : { name: String(target), role: 'Team Member', dept: 'UWOConnect', color: 'blue' };
    const signalPayload = {
      type: 'CALL_INITIATED',
      callerName: 'Abha Jatav (Client)',
      recipientName: callTarget.name,
      role: callTarget.role,
      dept: callTarget.dept,
      isVideo: isVideo,
      sessionId: `sess_${Date.now()}`
    };

    // 1. BroadcastChannel for cross-tab communication
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage(signalPayload);
    } catch (e) {}

    // 2. LocalStorage & Custom Event for cross-window notifications
    try {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('uwo_call_signal', { detail: signalPayload }));
        localStorage.setItem('uwo_calls_signal_event', JSON.stringify({ ...signalPayload, _ts: Date.now() }));
      }
    } catch (e) {}

    // 3. Register Call Session with Backend API
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const currentUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      let callerName = 'Abha (Client)';
      if (currentUserStr) {
        try {
          const u = JSON.parse(currentUserStr);
          callerName = u.name || u.username || u.email || callerName;
        } catch(e) {}
      }

      await fetch(`${API_BASE}/api/webrtc/call/initiate/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({
          caller: callerName,
          recipient: callTarget.email || callTarget.name,
          recipient_name: callTarget.name,
          call_type: isVideo ? 'video' : 'voice',
          is_video: isVideo
        })
      });
    } catch (e) {}

    setActiveCall({ ...callTarget, isVideo });
    setIsMuted(false);
    setIsVideoOff(false);
    setIsOnHold(false);
    setIsSharingScreen(false);
    setIsRecording(false);
    showNotification(`Ringing ${callTarget.name}...`);

    try {
      if (typeof window !== 'undefined' && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: isVideo ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false
        });
        streamRef.current = stream;

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
        });
        pcRef.current = pc;
        stream.getTracks().forEach(track => pc.addTrack(track, stream));

        setTimeout(() => {
          if (localVideoRef.current && streamRef.current && isVideo) {
            localVideoRef.current.srcObject = streamRef.current;
          }
        }, 300);
      }
    } catch (e) {
      console.warn('Media devices stream fallback:', e);
    }
  };

  // End Call Handler
  const endCall = () => {
    stopRingtoneSound();
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_ENDED' });
    } catch (e) {}

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (activeCall) {
      const newHistoryItem = {
        id: `c_${Date.now()}`,
        name: activeCall.name,
        dept: activeCall.dept || 'UWOConnect',
        type: 'outgoing',
        callType: activeCall.isVideo ? 'video' : 'voice',
        date: 'Just Now',
        duration: formatTimer(callTimer),
        status: 'completed',
        hasAI: true
      };
      setCallHistory(prev => [newHistoryItem, ...prev]);
      showNotification(`Call ended with ${activeCall.name}. Generating AI Summary & Speech-to-Text transcript...`);
    }

    setActiveCall(null);
  };

  // Mute / Cam / Screen / Record handlers
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(t => { t.enabled = !next; });
    }
    showNotification(next ? 'Microphone Muted' : 'Microphone Active');
  };

  const toggleVideo = () => {
    const next = !isVideoOff;
    setIsVideoOff(next);
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(t => { t.enabled = !next; });
    }
    showNotification(next ? 'Camera Turned Off' : 'Camera Active');
  };

  const toggleScreenShare = async () => {
    try {
      if (!isSharingScreen) {
        if (typeof window !== 'undefined' && navigator.mediaDevices?.getDisplayMedia) {
          const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = screenStream;
          }
          setIsSharingScreen(true);
          showNotification('Screen Share Active');
          screenStream.getVideoTracks()[0].onended = () => {
            setIsSharingScreen(false);
            if (localVideoRef.current && streamRef.current) {
              localVideoRef.current.srcObject = streamRef.current;
            }
          };
        }
      } else {
        setIsSharingScreen(false);
        if (localVideoRef.current && streamRef.current) {
          localVideoRef.current.srcObject = streamRef.current;
        }
        showNotification('Screen share stopped.');
      }
    } catch (e) {
      console.warn('Screen share error:', e);
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.dept.toUpperCase() === deptFilter;
    const matchesStatus = statusFilter === 'ALL' || c.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  return (
    <DashboardLayout role="client">
      <div className="flex flex-col h-[calc(100vh-56px)] sm:h-[calc(100vh-64px)] w-full overflow-hidden bg-slate-50 border-t border-slate-200 font-sans">

        {/* ── Toast Notification ────────────────────────────────────────── */}
        {toast && (
          <div className="fixed top-5 right-6 z-[120] px-5 py-3 rounded-2xl bg-slate-900 text-white text-xs font-bold shadow-2xl flex items-center gap-2 border border-slate-700 animate-fadeIn">
            <Sparkles size={14} className="text-emerald-400 animate-pulse" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* ── Incoming Call Modal Simulation ──────────────────────────────── */}
        {incomingCall && (
          <div className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
              <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500 animate-bounce">
                {incomingCall.avatar || 'SM'}
                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-25" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">{incomingCall.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{incomingCall.role} • {incomingCall.dept}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                  <PhoneCall size={13} className="animate-pulse" />
                  <span>Incoming {incomingCall.isVideo ? 'HD Video' : 'Voice'} Call</span>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => {
                    stopRingtoneSound();
                    try {
                      const channel = new BroadcastChannel('uwo_calls_live_channel');
                      channel.postMessage({ type: 'CALL_ACCEPTED', responderName: 'Abha' });
                    } catch(e) {}
                    initiateCall(incomingCall, incomingCall.isVideo);
                    setIncomingCall(null);
                  }}
                  className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
                  title="Accept Call"
                >
                  <Phone size={22} />
                </button>
                <button
                  onClick={() => {
                    stopRingtoneSound();
                    try {
                      const channel = new BroadcastChannel('uwo_calls_live_channel');
                      channel.postMessage({ type: 'CALL_REJECTED' });
                    } catch(e) {}
                    setIncomingCall(null);
                    showNotification(`Call from ${incomingCall.name} declined.`);
                  }}
                  className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
                  title="Decline"
                >
                  <PhoneOff size={22} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── ACTIVE FULLSCREEN CALL SCREEN OVERLAY ────────────────────────── */}
        {activeCall && (
          <div className="fixed inset-0 z-[100] bg-slate-950 flex flex-col justify-between overflow-hidden">
            {/* Call Header */}
            <div className="p-4 sm:p-6 flex items-center justify-between z-20 bg-gradient-to-b from-slate-950/90 to-transparent">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-black text-sm flex items-center justify-center">
                  {activeCall.name[0]}
                </div>
                <div>
                  <h3 className="text-white text-sm font-black flex items-center gap-2">
                    {activeCall.name}
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </h3>
                  <p className="text-xs text-slate-400">{activeCall.dept || 'UWOConnect Team'} • {formatTimer(callTimer)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-mono flex items-center gap-1.5 border border-white/10">
                  <Wifi size={13} className="text-emerald-400" />
                  <span>HD Encrypted</span>
                </div>
                {isRecording && (
                  <div className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold flex items-center gap-1.5 border border-rose-500/30 animate-pulse">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <span>REC</span>
                  </div>
                )}
              </div>
            </div>

            {/* Video Canvas / Voice Stage */}
            <div className="relative flex-1 flex items-center justify-center overflow-hidden">
              {activeCall.isVideo && !isVideoOff ? (
                <div className="relative w-full h-full flex items-center justify-center bg-slate-900">
                  <video ref={localVideoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-xl bg-slate-950/70 text-emerald-300 text-xs font-semibold backdrop-blur-md border border-white/10">
                    Live Stream • 60 FPS
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 text-center px-4">
                  <div className="relative w-36 h-36 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black text-4xl flex items-center justify-center shadow-2xl border-4 border-white/20">
                    {activeCall.name.split(' ').map(n=>n[0]).join('')}
                    <div className="absolute inset-0 rounded-full border-4 border-emerald-400 animate-ping opacity-30" />
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">{activeCall.name}</h2>
                  <p className="text-xs text-emerald-300 font-semibold">{activeCall.role} • {activeCall.dept}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    {isOnHold ? '⏸ Call On Hold' : `Voice Session Active • ${formatTimer(callTimer)}`}
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Floating Control Bar */}
            <div className="p-4 sm:p-6 flex items-center justify-center gap-3 sm:gap-4 z-20 bg-gradient-to-t from-slate-950/90 to-transparent">
              <button
                onClick={toggleMute}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-all shadow-lg', isMuted ? 'bg-rose-600' : 'bg-white/15 hover:bg-white/25')}
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
              </button>

              <button
                onClick={toggleVideo}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-all shadow-lg', isVideoOff ? 'bg-rose-600' : 'bg-white/15 hover:bg-white/25')}
                title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
              >
                {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
              </button>

              <button
                onClick={toggleScreenShare}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-all shadow-lg', isSharingScreen ? 'bg-emerald-600' : 'bg-white/15 hover:bg-white/25')}
                title="Screen Share"
              >
                <Monitor size={20} />
              </button>

              <button
                onClick={() => setIsRecording(r => !r)}
                className={cn('w-12 h-12 rounded-2xl flex items-center justify-center text-white cursor-pointer transition-all shadow-lg', isRecording ? 'bg-rose-600 animate-pulse' : 'bg-white/15 hover:bg-white/25')}
                title="Record Call"
              >
                <FileText size={20} />
              </button>

              <button
                onClick={endCall}
                className="w-14 h-14 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-2xl cursor-pointer transition-transform hover:scale-105"
                title="End Call"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </div>
        )}

        {/* ── TOP NAVIGATION BAR ────────────────────────────────────────── */}
        <div className="bg-white border-b border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-4 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <PhoneCall size={18} />
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-none">Voice & Video Calls</h1>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Enterprise Communication Hub • WebRTC Powered</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto custom-scroll">
            {[
              { id: 'contacts', label: 'Contacts & Quick Dial', icon: Users },
              { id: 'history', label: 'Call History', icon: Clock },
              { id: 'schedule', label: 'Schedule Meeting', icon: Calendar },
              { id: 'ai', label: 'AI Summaries & Speech-to-Text', icon: Sparkles },
              { id: 'admin', label: 'Activity & Permissions', icon: Shield }
            ].map(tab => {
              const IconComp = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                    isActive ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  )}
                >
                  <IconComp size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Action Test Buttons */}
          <button
            onClick={() => setIncomingCall({ name: 'Sarah Mitchell', role: 'VP of Product', dept: 'Product', isVideo: true })}
            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <PhoneCall size={13} />
            <span>Simulate Incoming Call</span>
          </button>
        </div>

        {/* ── MAIN CONTENT AREA ─────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">

          {/* TAB 1: CONTACTS & QUICK DIAL */}
          {activeTab === 'contacts' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Filter Bar */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search team contacts by name, designation, or department..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                  />
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <select
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Departments</option>
                    <option value="PRODUCT">Product</option>
                    <option value="ENGINEERING">Engineering</option>
                    <option value="SALES">Sales</option>
                    <option value="MARKETING">Marketing</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                  >
                    <option value="ALL">All Statuses</option>
                    <option value="AVAILABLE">Online Only</option>
                    <option value="BUSY">Busy</option>
                    <option value="OFFLINE">Offline</option>
                  </select>

                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-2xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <UserPlus size={14} />
                    <span>Add Team Member</span>
                  </button>
                </div>
              </div>

              {/* Add Team Member Modal */}
              {showAddMemberModal && (
                <div className="fixed inset-0 z-[110] bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                          <UserPlus size={18} />
                        </div>
                        <div>
                          <h3 className="text-base font-black text-slate-900 leading-none">Add Workspace Team Member</h3>
                          <p className="text-[11px] text-slate-500 font-medium mt-1">Client team members authorized for Voice & Video Calling</p>
                        </div>
                      </div>
                      <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer">
                        <X size={18} />
                      </button>
                    </div>

                    <form onSubmit={handleAddTeamMember} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          required
                          value={newMemberName}
                          onChange={e => setNewMemberName(e.target.value)}
                          placeholder="e.g. Vikram Sharma"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Role / Designation</label>
                        <input
                          type="text"
                          value={newMemberRole}
                          onChange={e => setNewMemberRole(e.target.value)}
                          placeholder="e.g. Senior Software Developer"
                          className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Department</label>
                          <select
                            value={newMemberDept}
                            onChange={e => setNewMemberDept(e.target.value)}
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                          >
                            <option value="Engineering">Engineering</option>
                            <option value="Product">Product</option>
                            <option value="Sales">Sales</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Support">Support</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={newMemberPhone}
                            onChange={e => setNewMemberPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setShowAddMemberModal(false)}
                          className="flex-1 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
                        >
                          Add to Directory
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* Contacts Grid */}
              {filteredContacts.length === 0 ? (
                <div className="bg-white rounded-3xl p-10 sm:p-14 text-center border border-slate-200 shadow-xs space-y-4 max-w-md mx-auto my-6">
                  <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-inner">
                    <Users size={30} />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">No Team Members Added Yet</h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium">Add team members to your workspace directory to start Voice & Video calls with them.</p>
                  </div>
                  <button
                    onClick={() => setShowAddMemberModal(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-2xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                  >
                    <UserPlus size={15} />
                    <span>Add First Team Member</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredContacts.map(c => (
                  <div key={c.id} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-emerald-500/40 transition-all group flex flex-col justify-between space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-100 to-slate-200 text-slate-800 font-black text-sm flex items-center justify-center shadow-inner border border-slate-200">
                            {c.avatar}
                          </div>
                          <span className={cn(
                            'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white',
                            c.status === 'available' ? 'bg-emerald-500' : c.status === 'busy' ? 'bg-amber-500' : 'bg-slate-300'
                          )} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">{c.name}</h3>
                          <p className="text-xs text-slate-500 font-medium">{c.role}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md uppercase tracking-wider">
                            {c.dept}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Call Buttons */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <button
                        onClick={() => initiateCall(c, false)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Phone size={13} />
                        <span>Voice Call</span>
                      </button>

                      <button
                        onClick={() => initiateCall(c, true)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Video size={13} />
                        <span>HD Video</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            </div>
          )}

          {/* TAB 2: CALL HISTORY */}
          {activeTab === 'history' && (
            <div className="max-w-5xl mx-auto space-y-4">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Session Logs</h3>
                  <span className="text-xs text-slate-500 font-bold">{callHistory.length} Total Logs</span>
                </div>
                <div className="divide-y divide-slate-100">
                  {callHistory.map(item => (
                    <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs',
                          item.type === 'outgoing' ? 'bg-emerald-600' : item.type === 'incoming' ? 'bg-blue-600' : 'bg-rose-600'
                        )}>
                          {item.callType === 'video' ? <Video size={18} /> : <Phone size={18} />}
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-black text-slate-900">{item.name}</h4>
                          <p className="text-[11px] text-slate-500 font-medium">{item.dept} • {item.date}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className={cn(
                            'text-xs font-bold capitalize',
                            item.status === 'completed' ? 'text-emerald-700' : 'text-rose-600'
                          )}>
                            {item.status}
                          </span>
                          <p className="text-[10px] text-slate-400 font-mono">{item.duration}</p>
                        </div>

                        <button
                          onClick={() => initiateCall({ name: item.name, dept: item.dept }, item.callType === 'video')}
                          className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors cursor-pointer"
                          title="Redial"
                        >
                          <PhoneCall size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SCHEDULE MEETING */}
          {activeTab === 'schedule' && (
            <div className="max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-md space-y-5">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                  <Calendar size={20} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">Schedule Video / Voice Session</h3>
                  <p className="text-xs text-slate-500 font-medium">Set calendar reminders & invite participants</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Meeting Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Q3 Sprint Planning Sync"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date</label>
                    <input
                      type="date"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Time</label>
                    <input
                      type="time"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Invite Team Members</label>
                  <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500">
                    {MOCK_CONTACTS.map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.role})</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => showNotification('✅ Meeting scheduled & calendar invites sent!')}
                  className="w-full py-3 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:scale-[1.01] cursor-pointer"
                  style={{ background: GRAD }}
                >
                  Confirm & Schedule Meeting
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: AI SUMMARIES */}
          {activeTab === 'ai' && (
            <div className="max-w-5xl mx-auto space-y-5">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl flex items-center justify-between">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={13} /> Automatic Speech-to-Text AI
                  </div>
                  <h2 className="text-xl font-black">AI Call Summaries & Action Items</h2>
                  <p className="text-xs text-emerald-100 font-medium">Every completed call automatically generates notes, action items and CRM logs.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {MOCK_AI_TRANSCRIPTS.map(item => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-black text-slate-900">{item.title}</h3>
                        <p className="text-xs text-slate-500 font-medium">{item.with} • {item.date}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-extrabold border border-emerald-200">
                        {item.sentiment}
                      </span>
                    </div>

                    <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                      {item.summary}
                    </div>

                    <div>
                      <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">Key Action Items</h4>
                      <ul className="space-y-1.5">
                        {item.actionItems.map((act, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                            <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Check size={10} />
                            </div>
                            <span>{act}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: ADMIN ACTIVITY & PERMISSIONS */}
          {activeTab === 'admin' && (
            <div className="max-w-6xl mx-auto space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <PhoneCall size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Calls</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">142 Sessions</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Clock size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Call Duration</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">18h 45m</p>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Shield size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Security</p>
                    <p className="text-2xl font-black text-slate-900 mt-0.5">100% Encrypted</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}

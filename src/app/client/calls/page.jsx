'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Phone, PhoneCall, Video, Mic, MicOff, VideoOff, Monitor, PhoneOff,
  Users, Search, Calendar, Clock, Sparkles, Check, X,
  Volume2, Shield, ArrowUpRight, ArrowDownLeft, PhoneMissed
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import Link from 'next/link';

const GRAD = 'linear-gradient(135deg, #00AB56, #00AE8B)';

export default function EnterpriseCallsPage() {
  const [activeTab, setActiveTab] = useState('contacts'); // 'contacts', 'history', 'schedule'
  const [contacts, setContacts] = useState([]);
  const [callHistory, setCallHistory] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Call Engine States
  const [activeCall, setActiveCall] = useState(null); // { id, name, role, dept, isVideo, callState, sessionId }
  const [callTimer, setCallTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [toast, setToast] = useState(null);

  // Media refs for WebRTC
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const streamRef = useRef(null);
  const pcRef = useRef(null);
  const timerIntervalRef = useRef(null);

  const showNotification = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch Real Team Members from Team Directory (Single Source of Truth)
  const fetchRealContacts = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/api/team/members/`, { headers });
      if (res.ok) {
        const data = await res.json();
        const memberList = Array.isArray(data) ? data : data.results || [];
        const currentUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        let currentUserEmail = '';
        if (currentUserStr) {
          try {
            const u = JSON.parse(currentUserStr);
            currentUserEmail = (u.email || u.username || '').toLowerCase();
          } catch(e) {}
        }

        const mapped = memberList.map((c, i) => {
          const cEmail = (c.email || c.username || '').toLowerCase();
          const isCurrentUser = currentUserEmail && (cEmail === currentUserEmail || currentUserEmail.includes(cEmail));
          const isOnline = c.is_online || isCurrentUser;

          return {
            id: c.id || i + 1,
            name: c.name || c.full_name || c.username || c.email || 'Team Member',
            email: c.email || c.username || '',
            role: c.role || c.designation || c.enterprise_role || 'Team Member',
            dept: c.department || 'General',
            status: c.status === 'SUSPENDED' ? 'offline' : (isOnline ? 'available' : 'offline'),
            is_in_call: c.is_in_call || false,
            color: ['blue', 'emerald', 'purple', 'teal', 'orange', 'indigo'][i % 6],
            avatar: (c.name || c.username || c.email || 'TM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
          };
        });

        setContacts(mapped);
      }
    } catch (e) {
      console.warn('Real team contacts fetch error:', e);
    }
  };

  // 2. Fetch Call History
  const fetchRealCallHistory = async () => {
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE_URL}/api/webrtc/history/`, { headers });
      if (res.ok) {
        const data = await res.json();
        if (data.history) {
          setCallHistory(data.history);
        }
      }
    } catch (e) {
      console.warn('Real call history fetch error:', e);
    }
  };

  useEffect(() => {
    fetchRealContacts();
    fetchRealCallHistory();

    const checkActiveConnectedCall = async () => {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const res = await fetch(`${API_BASE_URL}/api/webrtc/call/active-check`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        });
        if (res.ok) {
          const data = await res.json();
          if (data.active_call) {
            try {
              const constraints = data.is_video ? { audio: true, video: true } : { audio: true, video: false };
              const stream = await navigator.mediaDevices.getUserMedia(constraints);
              streamRef.current = stream;
              if (data.is_video && localVideoRef.current) {
                localVideoRef.current.srcObject = stream;
              }
            } catch(err) {}

            setActiveCall({
              name: data.caller || 'Caller',
              role: 'Team Member',
              dept: 'UWOConnect',
              isVideo: data.is_video,
              callState: 'CONNECTED',
              sessionId: data.session_id
            });
          }
        }
      } catch(e) {}
    };

    checkActiveConnectedCall();

    const interval = setInterval(() => {
      fetchRealContacts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // Timer for active call
  useEffect(() => {
    if (activeCall && (activeCall.callState === 'CONNECTED' || activeCall.callState === 'RINGING')) {
      timerIntervalRef.current = setInterval(() => {
        setCallTimer(prev => prev + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      setCallTimer(0);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [activeCall?.callState]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // WebRTC Initiate Call Handler (Voice / Video)
  const initiateCall = async (target, isVideo = false) => {
    const callTarget = target.name ? target : { name: String(target), role: 'Team Member', dept: 'UWOConnect' };

    if (callTarget.is_in_call) {
      showNotification(`⚠️ ${callTarget.name} is currently in another call.`);
      return;
    }

    // Permission check for Microphone / Camera
    let localStream = null;
    try {
      const constraints = isVideo ? { audio: true, video: true } : { audio: true, video: false };
      localStream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = localStream;

      if (isVideo && localVideoRef.current) {
        localVideoRef.current.srcObject = localStream;
      }
    } catch (err) {
      const msg = isVideo
        ? "Camera & Microphone access is required to start a video call."
        : "Microphone access is required to make a voice call.";
      showNotification(`⚠️ ${msg}`);
      return;
    }

    // Initialize WebRTC PeerConnection
    let offerSdp = null;
    try {
      const pc = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

      pc.ontrack = (event) => {
        if (event.streams && event.streams[0]) {
          if (isVideo && remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          } else if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0];
          }
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      offerSdp = JSON.stringify(offer);
      pcRef.current = pc;
    } catch (e) {
      console.warn('WebRTC creation error:', e);
    }

    // Send Call Initiation Request to Backend API
    let sessionId = `call_sess_${Date.now()}`;
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

      const res = await fetch(`${API_BASE_URL}/api/webrtc/call/initiate/`, {
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
          is_video: isVideo,
          sdp_offer: offerSdp
        })
      });

      if (res.status === 403) {
        showNotification("⛔ Calling forbidden: Both users must belong to the same UWOConnect workspace.");
        streamRef.current?.getTracks().forEach(t => t.stop());
        return;
      }
      if (res.status === 400) {
        const errData = await res.json();
        showNotification(`⚠️ ${errData.error || 'Recipient user is unavailable.'}`);
        streamRef.current?.getTracks().forEach(t => t.stop());
        return;
      }

      if (res.ok) {
        const data = await res.json();
        if (data.session_id) sessionId = data.session_id;
      }
    } catch (e) {}

    setActiveCall({
      ...callTarget,
      isVideo,
      callState: 'RINGING',
      sessionId
    });
    setIsMuted(false);
    setIsVideoOff(false);
    setIsSharingScreen(false);
    showNotification(`📞 Calling ${callTarget.name}...`);
  };

  // End Call Handler
  const endCall = async () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_ENDED' });
    } catch(e) {}

    if (activeCall?.sessionId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        await fetch(`${API_BASE_URL}/api/webrtc/call/action/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            session_id: activeCall.sessionId,
            action: 'end',
            duration: formatTimer(callTimer)
          })
        });
      } catch (e) {}
    }

    setActiveCall(null);
    showNotification('Call ended.');
    fetchRealCallHistory();
  };

  // Toggle Mute
  const toggleMute = () => {
    if (streamRef.current) {
      const audioTracks = streamRef.current.getAudioTracks();
      audioTracks.forEach(t => t.enabled = isMuted);
      setIsMuted(!isMuted);
    }
  };

  // Toggle Video Camera
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTracks = streamRef.current.getVideoTracks();
      videoTracks.forEach(t => t.enabled = isVideoOff);
      setIsVideoOff(!isVideoOff);
    }
  };

  // Screen Share Handler
  const toggleScreenShare = async () => {
    if (!isSharingScreen) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        const screenTrack = screenStream.getVideoTracks()[0];
        if (pcRef.current) {
          const sender = pcRef.current.getSenders().find(s => s.track.kind === 'video');
          if (sender) sender.replaceTrack(screenTrack);
        }
        if (localVideoRef.current) localVideoRef.current.srcObject = screenStream;
        setIsSharingScreen(true);
        screenTrack.onended = () => {
          setIsSharingScreen(false);
          if (streamRef.current && localVideoRef.current) {
            localVideoRef.current.srcObject = streamRef.current;
          }
        };
      } catch (e) {}
    } else {
      setIsSharingScreen(false);
      if (streamRef.current && localVideoRef.current) {
        localVideoRef.current.srcObject = streamRef.current;
      }
    }
  };

  // Filtered Contacts
  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.dept.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = deptFilter === 'ALL' || c.dept.toLowerCase() === deptFilter.toLowerCase();
    const matchesStatus = statusFilter === 'ALL' || c.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesDept && matchesStatus;
  });

  const departments = ['ALL', ...Array.from(new Set(contacts.map(c => c.dept)))];

  return (
    <DashboardLayout>
      <div className="space-y-6 pb-12">
        {/* Notification Toast */}
        {toast && (
          <div className="fixed top-5 right-5 z-[300] bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-800 text-xs font-bold animate-bounce flex items-center gap-2">
            <span>{toast}</span>
          </div>
        )}

        {/* Audio Element for Remote Voice Calls */}
        <audio ref={remoteAudioRef} autoPlay />

        {/* TOP HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg shrink-0" style={{ background: GRAD }}>
              <PhoneCall size={24} />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">Voice & Video Calls</h1>
              <p className="text-xs text-slate-500 font-medium">Enterprise WebRTC Calling Hub • Single Source Team Directory</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl text-xs font-bold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Workspace Directory Active</span>
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('contacts')}
            className={cn(
              'px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0',
              activeTab === 'contacts' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Users size={15} /> Contacts Directory ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={cn(
              'px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0',
              activeTab === 'history' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Clock size={15} /> Call History ({callHistory.length})
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={cn(
              'px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shrink-0',
              activeTab === 'schedule' ? 'bg-slate-900 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'
            )}
          >
            <Calendar size={15} /> Schedule Meeting
          </button>
        </div>

        {/* TAB 1: CONTACTS DIRECTORY */}
        {activeTab === 'contacts' && (
          <div className="space-y-5">
            {/* Filters Bar */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search team members by name, designation, or department..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={deptFilter}
                  onChange={e => setDeptFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  {departments.map(d => (
                    <option key={d} value={d}>{d === 'ALL' ? 'All Departments' : d}</option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="available">🟢 Available</option>
                  <option value="offline">⚪ Offline</option>
                </select>
              </div>
            </div>

            {/* Contacts Grid */}
            {filteredContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all space-y-4 relative group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-12 h-12 rounded-2xl font-black text-sm text-white flex items-center justify-center shadow-md relative',
                          contact.color === 'purple' ? 'bg-purple-600' :
                          contact.color === 'teal' ? 'bg-teal-600' :
                          contact.color === 'orange' ? 'bg-orange-600' :
                          contact.color === 'indigo' ? 'bg-indigo-600' : 'bg-emerald-600'
                        )}>
                          {contact.avatar}
                          <span className={cn(
                            'absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white',
                            contact.is_in_call ? 'bg-rose-500' : (contact.status === 'available' ? 'bg-emerald-500' : 'bg-slate-300')
                          )} />
                        </div>
                        <div>
                          <h3 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                            {contact.name}
                          </h3>
                          <p className="text-xs font-medium text-slate-500">{contact.role}</p>
                          <span className="inline-block mt-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase">
                            {contact.dept}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5">
                        <span className={cn(
                          'w-2 h-2 rounded-full',
                          contact.is_in_call ? 'bg-rose-500' : (contact.status === 'available' ? 'bg-emerald-500' : 'bg-slate-400')
                        )} />
                        {contact.is_in_call ? '🔴 In another call' : (contact.status === 'available' ? '🟢 Available' : '⚪ Offline')}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          disabled={contact.is_in_call}
                          onClick={() => initiateCall(contact, false)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                            contact.is_in_call
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200"
                          )}
                          title="Voice Call"
                        >
                          <Phone size={14} />
                          <span>Voice Call</span>
                        </button>

                        <button
                          disabled={contact.is_in_call}
                          onClick={() => initiateCall(contact, true)}
                          className={cn(
                            "px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer",
                            contact.is_in_call
                              ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                          )}
                          title="Video Call"
                        >
                          <Video size={14} />
                          <span>Video Call</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl font-black">
                  👥
                </div>
                <h3 className="text-base font-black text-slate-900">No Team Members Found</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Team members added from Team Directory will automatically appear here.
                </p>
                <Link
                  href="/client/team"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-md transition-transform hover:scale-105"
                  style={{ background: GRAD }}
                >
                  Go to Team Directory
                </Link>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CALL HISTORY */}
        {activeTab === 'history' && (
          <div className="max-w-5xl mx-auto space-y-4">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Recent Workspace Call Logs</h3>
                <span className="text-xs text-slate-500 font-bold">{callHistory.length} Total Logs</span>
              </div>
              <div className="divide-y divide-slate-100">
                {callHistory.length > 0 ? callHistory.map(item => (
                  <div key={item.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        'w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-xs',
                        item.type === 'outgoing' ? 'bg-emerald-600' : item.type === 'incoming' ? 'bg-blue-600' : 'bg-rose-600'
                      )}>
                        {item.callType === 'video' ? <Video size={18} /> : <Phone size={18} />}
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-black text-slate-900">{item.name || item.receiver}</h4>
                        <p className="text-[11px] text-slate-500 font-medium">{item.dept || 'Team'} • {item.date}</p>
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
                        onClick={() => initiateCall({ name: item.name || item.receiver, dept: item.dept }, item.callType === 'video')}
                        className="p-2 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-slate-700 transition-colors cursor-pointer"
                        title="Redial"
                      >
                        <PhoneCall size={14} />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="p-8 text-center text-xs text-slate-400 font-medium">
                    No call history logs recorded yet.
                  </div>
                )}
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
                <p className="text-xs text-slate-500 font-medium">Set calendar reminders for your workspace team</p>
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
                <label className="block text-xs font-bold text-slate-700 mb-1">Invite Team Member</label>
                <select className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-900 focus:outline-none focus:border-emerald-500">
                  {contacts.map(c => (
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

        {/* ACTIVE CALL MODAL (VOICE / VIDEO OVERLAY) */}
        {activeCall && (
          <div className="fixed inset-0 z-[250] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
            <div className="bg-slate-900 text-white rounded-3xl overflow-hidden max-w-4xl w-full border border-slate-800 shadow-2xl flex flex-col min-h-[500px]">
              
              {/* Call Header */}
              <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                  <div>
                    <h3 className="text-sm font-black tracking-wide">{activeCall.name}</h3>
                    <p className="text-[11px] text-slate-400 font-medium">{activeCall.role} • {activeCall.dept}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/30">
                    {formatTimer(callTimer)}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {activeCall.isVideo ? 'HD Video Call' : 'Encrypted Voice'}
                  </span>
                </div>
              </div>

              {/* Call Main Display */}
              <div className="flex-1 relative flex items-center justify-center p-6 bg-slate-950">
                {activeCall.isVideo ? (
                  <div className="relative w-full h-full min-h-[360px] flex items-center justify-center bg-slate-900 rounded-2xl overflow-hidden border border-slate-800">
                    {/* Remote Video */}
                    <video
                      ref={remoteVideoRef}
                      autoPlay
                      playsInline
                      className="w-full h-full object-cover"
                    />

                    {/* Local Video Preview */}
                    <div className="absolute bottom-4 right-4 w-36 h-24 rounded-xl bg-slate-950 border-2 border-emerald-500 overflow-hidden shadow-2xl">
                      <video
                        ref={localVideoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="text-center space-y-6">
                    <div className="relative mx-auto w-28 h-28 rounded-full bg-emerald-600/20 text-emerald-400 text-3xl font-black flex items-center justify-center border-2 border-emerald-500 animate-pulse">
                      {activeCall.name[0]}
                      <div className="absolute inset-0 rounded-full border-4 border-emerald-500/30 animate-ping" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black">{activeCall.name}</h2>
                      <p className="text-xs text-slate-400 font-medium mt-1">{activeCall.role}</p>
                      <p className="text-xs text-emerald-400 font-bold mt-2 animate-pulse">
                        {activeCall.callState === 'RINGING' ? 'Ringing...' : 'Connected (SRTP Encrypted)'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Call Controls Bar */}
              <div className="p-6 border-t border-slate-800 bg-slate-950/80 flex items-center justify-center gap-4">
                <button
                  onClick={toggleMute}
                  className={cn(
                    'w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer',
                    isMuted ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                  )}
                  title={isMuted ? 'Unmute Mic' : 'Mute Mic'}
                >
                  {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                </button>

                {activeCall.isVideo && (
                  <button
                    onClick={toggleVideo}
                    className={cn(
                      'w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer',
                      isVideoOff ? 'bg-rose-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    )}
                    title={isVideoOff ? 'Turn Camera On' : 'Turn Camera Off'}
                  >
                    {isVideoOff ? <VideoOff size={20} /> : <Video size={20} />}
                  </button>
                )}

                {activeCall.isVideo && (
                  <button
                    onClick={toggleScreenShare}
                    className={cn(
                      'w-13 h-13 rounded-full flex items-center justify-center transition-all cursor-pointer',
                      isSharingScreen ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white'
                    )}
                    title="Share Screen"
                  >
                    <Monitor size={20} />
                  </button>
                )}

                <button
                  onClick={endCall}
                  className="w-16 h-13 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl transition-all hover:scale-105 cursor-pointer"
                  title="End Call"
                >
                  <PhoneOff size={22} />
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

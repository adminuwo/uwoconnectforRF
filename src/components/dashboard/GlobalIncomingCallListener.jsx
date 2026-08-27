'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { API_BASE_URL } from '@/config/apiConfig';

export default function GlobalIncomingCallListener() {
  const router = useRouter();
  const pathname = usePathname();
  const [incomingCall, setIncomingCall] = useState(null);
  const ringtoneRef = useRef(null);
  const wsRef = useRef(null);
  const pendingOfferRef = useRef(null);

  const startRingtone = () => {
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

  const stopRingtone = () => {
    if (ringtoneRef.current) {
      ringtoneRef.current();
      ringtoneRef.current = null;
    }
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
    if (!token) return;

    const backendUrlStr = API_BASE_URL || 'http://127.0.0.1:8080';
    const isSecureBackend = backendUrlStr.startsWith('https');
    const protocol = isSecureBackend ? 'wss:' : 'ws:';
    const backendHost = new URL(backendUrlStr).host;
    const wsUrl = `${protocol}//${backendHost}/ws/webrtc/?token=${token}`;

    const handleCallSignal = (data) => {
      if (!data) return;
      if (data.type === 'CALL_INITIATED') {
        setIncomingCall({
          callerName: data.callerName || 'Client / Team Member',
          role: data.role || 'Member',
          dept: data.dept || 'UWOConnect',
          isVideo: data.isVideo,
          sessionId: data.sessionId
        });
        if (!ringtoneRef.current) {
          startRingtone();
        }
      } else if (data.type === 'CALL_ACCEPTED' || data.type === 'CALL_REJECTED' || data.type === 'CALL_ENDED') {
        stopRingtone();
        setIncomingCall(null);
      }
    };

    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'offer') {
          pendingOfferRef.current = data;
          setIncomingCall({
            callerName: data.caller || 'Client / Team Member',
            role: 'Team Member',
            dept: 'Workspace',
            isVideo: data.isVideo,
            callerEmail: data.callerEmail
          });
          startRingtone();
        } else if (data.type === 'call_ended') {
          stopRingtone();
          setIncomingCall(null);
          pendingOfferRef.current = null;
        }
      } catch (e) {}
    };

    // 4. Backend Active Call Poller (Cross-Device & Cross-Browser)
    let isPollingCall = false;
    let pollInterval = null;

    const runActiveCheck = async () => {
      if (isPollingCall) return;
      isPollingCall = true;
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch(`${API_BASE_URL}/api/webrtc/call/active-check`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          const data = await res.json();
          const wasActed = data.session_id && (
            sessionStorage.getItem(`call_acted_${data.session_id}`) === 'true'
          );

          const currentUserStr = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
          let currentUserName = '';
          let currentUserEmail = '';
          if (currentUserStr) {
            try {
              const u = JSON.parse(currentUserStr);
              currentUserName = (u.username || '').toLowerCase();
              currentUserEmail = (u.email || '').toLowerCase();
            } catch(e) {}
          }

          const isUserCaller = data.is_caller || 
            (currentUserName && data.caller?.toLowerCase() === currentUserName) || 
            (currentUserEmail && data.caller?.toLowerCase() === currentUserEmail);

          if (data.active_call && data.status === 'RINGING' && !isUserCaller && !wasActed) {
            handleCallSignal({
              type: 'CALL_INITIATED',
              callerName: data.caller || 'Abha (Client)',
              role: 'Client',
              dept: 'UWOConnect',
              isVideo: data.is_video,
              sessionId: data.session_id
            });
          } else if (!data.active_call) {
            // Only stop ringtone and clear popup when call session is completely gone
            stopRingtone();
            setIncomingCall(null);
          }
        }
      } catch (e) {
      } finally {
        isPollingCall = false;
      }
    };

    // Delay start of background polling by 4s so initial page loads render instantly
    const initialTimer = setTimeout(() => {
      runActiveCheck();
      pollInterval = setInterval(runActiveCheck, 20000);
    }, 4000);

    return () => {
      clearTimeout(initialTimer);
      if (pollInterval) clearInterval(pollInterval);
      if (wsRef.current) wsRef.current.close();
      stopRingtone();
    };
  }, []);


  const handleAccept = async () => {
    stopRingtone();
    if (pendingOfferRef.current) {
      localStorage.setItem('webrtc_pending_offer', JSON.stringify(pendingOfferRef.current));
    }

    if (incomingCall?.sessionId) {
      sessionStorage.setItem(`call_acted_${incomingCall.sessionId}`, 'true');
      // Save incoming call data so calls/page.jsx can restore active call state
      localStorage.setItem('pending_incoming_call', JSON.stringify({
        sessionId: incomingCall.sessionId,
        callerName: incomingCall.callerName,
        isVideo: incomingCall.isVideo,
        role: incomingCall.role,
        dept: incomingCall.dept
      }));
    }
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_ACCEPTED', responderName: 'Team Member' });
    } catch(e) {}
    if (incomingCall?.sessionId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        await fetch(`${API_BASE_URL}/api/webrtc/call/action/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ session_id: incomingCall.sessionId, action: 'accept' })
        });
      } catch(e) {}
    }
    setIncomingCall(null);
    router.push('/client/calls');
  };

  const handleDecline = async () => {
    stopRingtone();
    if (wsRef.current && pendingOfferRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'call_ended',
        recipient: pendingOfferRef.current.callerEmail
      }));
    }

    if (incomingCall?.sessionId) {
      sessionStorage.setItem(`call_acted_${incomingCall.sessionId}`, 'true');
    }
    try {
      const channel = new BroadcastChannel('uwo_calls_live_channel');
      channel.postMessage({ type: 'CALL_REJECTED' });
    } catch(e) {}
    if (incomingCall?.sessionId) {
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        await fetch(`${API_BASE_URL}/api/webrtc/call/action/`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ session_id: incomingCall.sessionId, action: 'decline' })
        });
      } catch(e) {}
    }
    setIncomingCall(null);
    pendingOfferRef.current = null;
  };

  if (!incomingCall) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
        <div className="relative mx-auto w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-700 font-black text-2xl flex items-center justify-center border-2 border-emerald-500 animate-bounce">
          {incomingCall.callerName[0]}
          <div className="absolute inset-0 rounded-full border-4 border-emerald-500 animate-ping opacity-30" />
        </div>
        <div>
          <h3 className="text-lg font-black text-slate-900">{incomingCall.callerName}</h3>
          <p className="text-xs text-slate-500 font-semibold">{incomingCall.role} • {incomingCall.dept}</p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <PhoneCall size={14} className="animate-pulse text-emerald-600" />
            <span>Incoming {incomingCall.isVideo ? 'HD Video' : 'Voice'} Call...</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={handleAccept}
            className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
            title="Accept & Connect"
          >
            <Phone size={24} />
          </button>
          <button
            onClick={handleDecline}
            className="w-14 h-14 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl cursor-pointer transition-transform hover:scale-105"
            title="Decline"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, PhoneCall, PhoneOff } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function GlobalIncomingCallListener() {
  const router = useRouter();
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
    
    const token = localStorage.getItem('token');
    if (!token) return;

    const backendUrlStr = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    const isSecureBackend = backendUrlStr.startsWith('https');
    const protocol = isSecureBackend ? 'wss:' : (window.location.protocol === 'https:' ? 'wss:' : 'ws:');
    const backendHost = new URL(backendUrlStr).host;
    const wsUrl = `${protocol}//${backendHost}/ws/webrtc/?token=${token}`;

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

    return () => {
      if (wsRef.current) wsRef.current.close();
      stopRingtone();
    };
  }, []);

  const handleAccept = () => {
    stopRingtone();
    if (pendingOfferRef.current) {
      localStorage.setItem('webrtc_pending_offer', JSON.stringify(pendingOfferRef.current));
    }
    setIncomingCall(null);
    router.push('/client/calls');
  };

  const handleDecline = () => {
    stopRingtone();
    if (wsRef.current && pendingOfferRef.current) {
      wsRef.current.send(JSON.stringify({
        type: 'call_ended',
        recipient: pendingOfferRef.current.callerEmail
      }));
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

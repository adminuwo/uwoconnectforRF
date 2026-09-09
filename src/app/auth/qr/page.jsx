'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Smartphone, RefreshCw, CheckCircle2, XCircle, Clock, 
  ShieldCheck, ArrowLeft, Loader2, Laptop, ChevronRight, Lock, Copy, Check
} from 'lucide-react';
import { storeUserSession } from '@/features/auth/authHelpers';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';

export default function QrLoginPage() {
  const router = useRouter();
  const { brand } = useBrand();

  // States: 'LOADING' | 'WAITING' | 'SCANNED' | 'APPROVED' | 'EXPIRED' | 'CANCELLED'
  const [sessionStatus, setSessionStatus] = useState('LOADING');
  const [sessionId, setSessionId] = useState(null);
  const [qrPayload, setQrPayload] = useState('');
  const [secondsRemaining, setSecondsRemaining] = useState(120);
  const [deviceMeta, setDeviceMeta] = useState({ browser: '', os: '' });
  const [errorMsg, setErrorMsg] = useState('');
  const [userProfile, setUserProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  const wsRef = useRef(null);
  const pollTimerRef = useRef(null);
  const countdownTimerRef = useRef(null);

  // Initialize a fresh QR Session from backend
  const initQrSession = useCallback(async () => {
    // Clean up previous listeners
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    setSessionStatus('LOADING');
    setErrorMsg('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/qr/create/`, {}, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 8000
      });

      const { session_id, qr_payload, qr_url, expires_in_seconds, browser, operating_system } = res.data;
      const targetPayload = qr_payload || session_id;

      setSessionId(session_id);
      setQrPayload(targetPayload);
      setSecondsRemaining(expires_in_seconds || 120);
      setDeviceMeta({ browser: browser || 'Web Browser', os: operating_system || 'Desktop' });
      setSessionStatus('WAITING');

      // 1. Start Countdown Timer
      startCountdown(expires_in_seconds || 120);

      // 2. Connect WebSocket
      connectWebSocket(session_id);

      // 3. Start Polling Fallback (every 1.5s)
      startPolling(session_id);

    } catch (err) {
      console.error('Failed to initialize QR session:', err);
      setErrorMsg('Unable to connect to login server. Please try again.');
      setSessionStatus('EXPIRED');
    }
  }, []);

  const startCountdown = (totalSec) => {
    let current = totalSec;
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      current -= 1;
      setSecondsRemaining(current);
      if (current <= 0) {
        clearInterval(countdownTimerRef.current);
        setSessionStatus('EXPIRED');
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        if (wsRef.current) wsRef.current.close();
      }
    }, 1000);
  };

  const connectWebSocket = (sessId) => {
    try {
      const isSecure = API_BASE_URL.startsWith('https');
      const host = API_BASE_URL.replace(/^https?:\/\//, '');
      const wsProtocol = isSecure ? 'wss://' : 'ws://';
      const wsUrl = `${wsProtocol}${host}/ws/auth/qr/${sessId}/`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleStatusTransition(data);
        } catch (e) {}
      };

      ws.onerror = () => {
        // Fallback continues running seamlessly
      };
    } catch (e) {}
  };

  const startPolling = (sessId) => {
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/auth/qr/status/${sessId}/`, {
          timeout: 4000
        });
        handleStatusTransition(res.data);
      } catch (err) {
        if (err?.response?.status === 404) {
          clearInterval(pollTimerRef.current);
          setSessionStatus('EXPIRED');
        }
      }
    }, 1500);
  };

  const handleStatusTransition = (data) => {
    const status = data.status;

    if (status === 'SCANNED') {
      setSessionStatus('SCANNED');
    } else if (status === 'APPROVED' || status === 'AUTHENTICATED') {
      setSessionStatus('APPROVED');
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

      const token = data.token;
      const user = data.user;
      if (token && user) {
        setUserProfile(user);
        storeUserSession(token, user);
        setTimeout(() => {
          if (user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/client');
          }
        }, 1200);
      }
    } else if (status === 'CANCELLED' || status === 'REJECTED') {
      setSessionStatus('CANCELLED');
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    } else if (status === 'EXPIRED') {
      setSessionStatus('EXPIRED');
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    }
  };

  // Mount
  useEffect(() => {
    initQrSession();
    return () => {
      if (wsRef.current) wsRef.current.close();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
      if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
    };
  }, [initQrSession]);

  const formatTimer = (sec) => {
    const m = Math.floor(Math.max(0, sec) / 60);
    const s = Math.max(0, sec) % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-500/10 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/5 blur-[100px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">U</span>
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
            {brand?.name || 'UwoConnect'}
          </span>
        </Link>

        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Email & Password Login</span>
        </Link>
      </header>

      {/* Main Content Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800/80 rounded-[36px] shadow-2xl backdrop-blur-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Instructions */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/60 bg-gradient-to-b from-slate-900/40 to-slate-950/40">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold mb-6">
                <Laptop size={14} />
                <span>Instant Device Linking</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-3">
                Use Uwo Connect on your Web Browser
              </h1>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Log in instantly without typing your password by scanning this QR code with your logged-in mobile app.
              </p>

              {/* Numbered Steps */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Open Uwo Connect on your phone</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Make sure you are logged into your organization account.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Go to Settings → Linked Devices</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Tap on <strong className="text-emerald-400 font-semibold">&quot;Link a New Device&quot;</strong> to launch the scanner.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">Scan this QR code & tap &quot;Link Device&quot;</h4>
                    <p className="text-xs text-slate-400 mt-0.5">Your web session will authenticate immediately.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-8 pt-6 border-t border-slate-800/60 flex items-center gap-3 text-xs text-slate-400 font-medium">
              <ShieldCheck size={18} className="text-emerald-400 shrink-0" />
              <span>End-to-end device authorization. QR code is single-use and expires in 2 minutes.</span>
            </div>
          </div>

          {/* Right Column: QR Code & Real-Time States */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-slate-950/60 relative">
            
            {/* STATE 1: WAITING / LOADING */}
            {(sessionStatus === 'WAITING' || sessionStatus === 'LOADING') && (
              <div className="flex flex-col items-center">
                {/* QR Canvas Box */}
                <div className="relative p-5 bg-white rounded-3xl shadow-2xl shadow-emerald-500/10 border border-slate-200/40">
                  {sessionStatus === 'LOADING' ? (
                    <div className="w-[210px] h-[210px] flex flex-col items-center justify-center">
                      <Loader2 size={36} className="animate-spin text-emerald-600 mb-2" />
                      <span className="text-xs font-bold text-slate-600">Generating QR...</span>
                    </div>
                  ) : (
                    <QRCodeSVG
                      value={qrPayload || 'uwoconnect'}
                      size={210}
                      level="M"
                      includeMargin={false}
                    />
                  )}
                </div>

                {/* Countdown Timer */}
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-slate-300">
                  <Clock size={14} className="text-emerald-400" />
                  <span>QR code expires in:</span>
                  <span className={`font-mono text-sm px-2 py-0.5 rounded-lg ${
                    secondsRemaining < 30 ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'bg-slate-800 text-emerald-400'
                  }`}>
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>

                {/* Manual Session Code Copy Box */}
                {sessionId && (
                  <div className="mt-4 w-full max-w-[260px] bg-slate-900/90 border border-slate-800 rounded-2xl p-2.5 flex items-center justify-between gap-2 shadow-inner">
                    <div className="flex flex-col text-left overflow-hidden">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Session Code</span>
                      <span className="font-mono text-xs text-slate-200 truncate">{sessionId.slice(0, 8)}...{sessionId.slice(-6)}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(sessionId);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      title="Copy full session code to clipboard"
                      className="px-2.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Refresh Action */}
                <button
                  onClick={initQrSession}
                  className="mt-4 text-xs font-bold text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Refresh QR Code</span>
                </button>
              </div>
            )}

            {/* STATE 2: SCANNED */}
            {sessionStatus === 'SCANNED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6 relative">
                  <Smartphone size={38} className="animate-bounce" />
                  <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping" />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">QR Code Scanned!</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  Check your Uwo Connect mobile app and tap <strong className="text-emerald-400">&quot;Link Device&quot;</strong> to complete login.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 rounded-xl">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Waiting for phone confirmation...</span>
                </div>
              </div>
            )}

            {/* STATE 3: APPROVED */}
            {sessionStatus === 'APPROVED' && (
              <div className="flex flex-col items-center animate-fade-in py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-6">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Device Linked Successfully!</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-4">
                  Welcome{userProfile ? `, ${userProfile.name || userProfile.username}` : ''}. Redirecting to your dashboard...
                </p>
                <Loader2 size={24} className="animate-spin text-emerald-400 mt-2" />
              </div>
            )}

            {/* STATE 4: EXPIRED */}
            {sessionStatus === 'EXPIRED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  <Clock size={40} />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">QR Code Expired</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  For your security, login QR codes expire after 2 minutes. Click below to generate a new QR code.
                </p>
                <button
                  onClick={initQrSession}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Generate New QR Code</span>
                </button>
              </div>
            )}

            {/* STATE 5: CANCELLED */}
            {sessionStatus === 'CANCELLED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6">
                  <XCircle size={40} />
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Linking Cancelled</h3>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed mb-6">
                  The device linking request was cancelled from the mobile phone.
                </p>
                <button
                  onClick={initQrSession}
                  className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Try Again</span>
                </button>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
        <div>
          &copy; {new Date().getFullYear()} {brand?.name || 'UwoConnect'} · All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-slate-300 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Smartphone, RefreshCw, CheckCircle2, XCircle, Clock, 
  ShieldCheck, ArrowLeft, Loader2, Laptop, Copy, Check
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
  const [shortCode, setShortCode] = useState('');
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

      const { session_id, short_code, qr_payload, qr_url, expires_in_seconds, browser, operating_system } = res.data;
      const targetPayload = qr_payload || session_id;

      setSessionId(session_id);
      setShortCode(short_code || '');
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col justify-between relative overflow-hidden font-sans selection:bg-emerald-500 selection:text-white">
      {/* Soft background gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-emerald-100/60 blur-[130px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-[2px] shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
              <span className="text-xl font-black bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">U</span>
            </div>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
            {brand?.name || 'UwoConnect'}
          </span>
        </Link>

        <Link
          href="/auth/login"
          className="text-xs font-bold text-gray-500 hover:text-gray-900 bg-white hover:bg-gray-100 border border-gray-200 px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Email & Password Login</span>
        </Link>
      </header>

      {/* Main Content Center Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="w-full max-w-4xl bg-white border border-gray-200 rounded-[36px] shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
          
          {/* Left Column: Instructions */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 text-xs font-bold mb-6">
                <Laptop size={14} />
                <span>QR Login</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-gray-900 mb-3">
                Login with your Phone
              </h1>
              <p className="text-gray-500 text-sm font-medium leading-relaxed mb-8">
                Scan this QR code from your Uwo Connect app to log in instantly.
              </p>

              {/* Numbered Steps */}
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Open your Uwo Connect app</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Make sure you&apos;re logged in.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Go to Settings → Linked Devices</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Tap <strong className="text-emerald-600 font-semibold">&quot;Link a New Device&quot;</strong></p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-800">Scan this QR code</h4>
                    <p className="text-xs text-gray-400 mt-0.5">You&apos;ll be logged in automatically.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Security Note */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex items-center gap-3 text-xs text-gray-400 font-medium">
              <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
              <span>Secure, single-use code. Expires in 2 minutes.</span>
            </div>
          </div>

          {/* Right Column: QR Code & Real-Time States */}
          <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col items-center justify-center text-center bg-gray-50/60 relative">
            
            {/* STATE 1: WAITING / LOADING */}
            {(sessionStatus === 'WAITING' || sessionStatus === 'LOADING') && (
              <div className="flex flex-col items-center">
                {/* QR Canvas Box */}
                <div className="relative p-5 bg-white rounded-3xl shadow-lg border border-gray-100">
                  {sessionStatus === 'LOADING' ? (
                    <div className="w-[210px] h-[210px] flex flex-col items-center justify-center">
                      <Loader2 size={36} className="animate-spin text-emerald-600 mb-2" />
                      <span className="text-xs font-bold text-gray-400">Generating QR...</span>
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
                <div className="mt-6 flex items-center gap-2 text-xs font-bold text-gray-500">
                  <Clock size={14} className="text-emerald-500" />
                  <span>Expires in:</span>
                  <span className={`font-mono text-sm px-2 py-0.5 rounded-lg ${
                    secondsRemaining < 30 ? 'bg-rose-50 text-rose-500 border border-rose-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}>
                    {formatTimer(secondsRemaining)}
                  </span>
                </div>

                {/* Short Code Display */}
                {shortCode && (
                  <div className="mt-4 w-full max-w-[260px] bg-white border border-gray-200 rounded-2xl p-3 flex items-center justify-between gap-2 shadow-sm">
                    <div className="flex flex-col text-left">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Login Code</span>
                      <span className="font-mono text-2xl font-black text-gray-900 tracking-[0.3em]">{shortCode}</span>
                    </div>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(shortCode);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      title="Copy code"
                      className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                )}

                {/* Refresh Action */}
                <button
                  onClick={initQrSession}
                  className="mt-4 text-xs font-bold text-gray-400 hover:text-emerald-600 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw size={12} />
                  <span>Refresh QR Code</span>
                </button>
              </div>
            )}

            {/* STATE 2: SCANNED */}
            {sessionStatus === 'SCANNED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 mb-6 relative">
                  <Smartphone size={38} className="animate-bounce" />
                  <div className="absolute inset-0 rounded-full bg-emerald-100/50 animate-ping" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">QR Code Scanned!</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
                  Tap <strong className="text-emerald-600">&quot;Link Device&quot;</strong> on your phone to finish.
                </p>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-xl">
                  <Loader2 size={14} className="animate-spin" />
                  <span>Waiting for confirmation...</span>
                </div>
              </div>
            )}

            {/* STATE 3: APPROVED */}
            {sessionStatus === 'APPROVED' && (
              <div className="flex flex-col items-center animate-fade-in py-6">
                <div className="w-20 h-20 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 mb-6">
                  <CheckCircle2 size={44} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">You&apos;re in!</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-4">
                  Welcome{userProfile ? `, ${userProfile.name || userProfile.username}` : ''}. Redirecting...
                </p>
                <Loader2 size={24} className="animate-spin text-emerald-500 mt-2" />
              </div>
            )}

            {/* STATE 4: EXPIRED */}
            {sessionStatus === 'EXPIRED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mb-6">
                  <Clock size={40} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Code Expired</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
                  QR codes expire after 2 minutes. Tap below to get a new one.
                </p>
                <button
                  onClick={initQrSession}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <RefreshCw size={14} />
                  <span>Get New QR Code</span>
                </button>
              </div>
            )}

            {/* STATE 5: CANCELLED */}
            {sessionStatus === 'CANCELLED' && (
              <div className="flex flex-col items-center animate-fade-in py-4">
                <div className="w-20 h-20 rounded-full bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-500 mb-6">
                  <XCircle size={40} />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 mb-2">Cancelled</h3>
                <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-6">
                  Login was cancelled from your phone.
                </p>
                <button
                  onClick={initQrSession}
                  className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-2xl border border-gray-200 flex items-center gap-2 transition-all cursor-pointer"
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
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400 font-medium">
        <div>
          &copy; {new Date().getFullYear()} {brand?.name || 'UwoConnect'} · All rights reserved.
        </div>
        <div className="flex items-center gap-6">
          <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-gray-600 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}

'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { 
  Smartphone, RefreshCw, CheckCircle2, XCircle, Clock, 
  ShieldCheck, ArrowLeft, Loader2, Laptop, Copy, Check, QrCode,
  Sun, Moon
} from 'lucide-react';
import { motion } from 'framer-motion';
import AuthHeroSide from '@/components/auth/AuthHeroSide';
import { storeUserSession } from '@/features/auth/authHelpers';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';

export default function QrLoginPage() {
  const router = useRouter();
  const { brand } = useBrand();
  const { isDark, toggleTheme } = useTheme();

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
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 bg-[#f8fafc] dark:bg-[#070B14] font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />

      {/* Top Navbar */}
      <header className="relative z-20 w-full max-w-6xl mx-auto pt-4 pb-2 px-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {brand?.logo_url && brand.logo_url !== "/download (3).gif" ? (
            <img src={brand.logo_url} alt="Logo" className="w-11 h-11 object-contain rounded-full shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 shadow-[0_4px_20px_rgba(16,185,129,0.25)] border-[1.5px] border-emerald-100 dark:border-emerald-800/40 shrink-0">
              <img src="/logo.png" alt="UWO Connect Logo" className="w-full h-full object-contain p-1.5" />
            </div>
          )}
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-xl drop-shadow-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {brand?.brand_name || brand?.name || 'UWO Connect'}
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-xs hover:shadow-sm transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/auth/login"
            className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/70 border border-slate-200/80 dark:border-slate-700 px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xs hover:shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Email & Password Login</span>
          </Link>
        </div>
      </header>

      {/* Main Split Card */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center py-2 sm:py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[1000px] bg-white dark:bg-[#0F172A] rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden relative z-10 my-auto transition-colors"
        >
          {/* Left Side: Abha & Dev Hero */}
          <AuthHeroSide
            imageSrc="/abha_dev_qr.png"
            title={<>Seamless mobile <br/> authentication.</>}
            subtitle="Scan the QR code with your UWO Connect mobile app to log in securely without entering your password."
            badgeText="Secure • Fast • Passwordless"
          />

          {/* Right Side: QR Flow */}
          <div className="w-full md:w-3/5 p-6 sm:p-8 lg:p-10 flex flex-col justify-center bg-white dark:bg-[#0F172A] relative transition-colors">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-bold">
                  <Laptop size={14} />
                  <span>QR Login</span>
                </div>
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline md:hidden"
                >
                  Password Login →
                </Link>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Login with your Phone
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm font-medium leading-relaxed mb-6">
                Scan this QR code from your UWO Connect app to log in instantly.
              </p>

              {/* STATES */}
              {(sessionStatus === 'WAITING' || sessionStatus === 'LOADING') && (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  
                  {/* Left sub-column: Numbered Steps */}
                  <div className="sm:col-span-6 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-2xs">
                        1
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Open UWO Connect app</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">Make sure you&apos;re logged in.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-2xs">
                        2
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Go to Settings → Linked Devices</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">Tap <strong className="text-emerald-700 dark:text-emerald-400 font-semibold">&quot;Link a New Device&quot;</strong></p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-center text-xs font-black shrink-0 mt-0.5 shadow-2xs">
                        3
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Scan this QR code</h4>
                        <p className="text-[11px] text-slate-400 dark:text-slate-400 mt-0.5">You&apos;ll be logged in automatically.</p>
                      </div>
                    </div>
                  </div>

                  {/* Right sub-column: QR Code Display */}
                  <div className="sm:col-span-6 flex flex-col items-center justify-center p-4 bg-slate-50/80 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                    <div className="relative p-3 bg-white rounded-2xl shadow-md border border-slate-100">
                      {sessionStatus === 'LOADING' ? (
                        <div className="w-[170px] h-[170px] flex flex-col items-center justify-center">
                          <Loader2 size={32} className="animate-spin text-emerald-600 mb-2" />
                          <span className="text-xs font-bold text-slate-400">Generating QR...</span>
                        </div>
                      ) : (
                        <QRCodeSVG
                          value={qrPayload || 'uwoconnect'}
                          size={170}
                          level="M"
                          includeMargin={false}
                        />
                      )}
                    </div>

                    {/* Countdown Timer */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
                      <Clock size={13} className="text-emerald-500" />
                      <span>Expires in:</span>
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-lg font-bold ${
                        secondsRemaining < 30 ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800' : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                      }`}>
                        {formatTimer(secondsRemaining)}
                      </span>
                    </div>

                    {/* Short Code Display */}
                    {shortCode && (
                      <div className="mt-3 w-full max-w-[220px] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-2xs">
                        <div className="flex flex-col text-left">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Login Code</span>
                          <span className="font-mono text-lg font-black text-slate-900 dark:text-white tracking-[0.25em]">{shortCode}</span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(shortCode);
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                          }}
                          title="Copy code"
                          className="px-2.5 py-1 bg-emerald-50 dark:bg-emerald-950/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shrink-0"
                        >
                          {copied ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {/* Refresh Action */}
                    <button
                      onClick={initQrSession}
                      className="mt-3 text-xs font-bold text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Refresh QR Code</span>
                    </button>
                  </div>

                </div>
              )}

              {/* STATE 2: SCANNED */}
              {sessionStatus === 'SCANNED' && (
                <div className="flex flex-col items-center py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 relative shadow-xs">
                    <Smartphone size={32} className="animate-bounce" />
                    <div className="absolute inset-0 rounded-2xl bg-emerald-100/50 dark:bg-emerald-900/40 animate-ping" />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">QR Code Scanned!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-5">
                    Tap <strong className="text-emerald-700 dark:text-emerald-400">&quot;Link Device&quot;</strong> on your phone to finish.
                  </p>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-4 py-2 rounded-xl">
                    <Loader2 size={14} className="animate-spin" />
                    <span>Waiting for confirmation...</span>
                  </div>
                </div>
              )}

              {/* STATE 3: APPROVED */}
              {sessionStatus === 'APPROVED' && (
                <div className="flex flex-col items-center py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 shadow-xs">
                    <CheckCircle2 size={36} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">You&apos;re in!</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-4">
                    Welcome{userProfile ? `, ${userProfile.name || userProfile.username}` : ''}. Redirecting...
                  </p>
                  <Loader2 size={24} className="animate-spin text-emerald-600 mt-2" />
                </div>
              )}

              {/* STATE 4: EXPIRED */}
              {sessionStatus === 'EXPIRED' && (
                <div className="flex flex-col items-center py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-500 dark:text-amber-400 mb-4 shadow-xs">
                    <Clock size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">Code Expired</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-5">
                    QR codes expire after 2 minutes for security.
                  </p>
                  <button
                    onClick={initQrSession}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Get New QR Code</span>
                  </button>
                </div>
              )}

              {/* STATE 5: CANCELLED */}
              {sessionStatus === 'CANCELLED' && (
                <div className="flex flex-col items-center py-8 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-500 dark:text-rose-400 mb-4 shadow-xs">
                    <XCircle size={32} />
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-1.5">Cancelled</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed mb-5">
                    Login was cancelled from your phone.
                  </p>
                  <button
                    onClick={initQrSession}
                    className="px-6 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold text-xs rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>Try Again</span>
                  </button>
                </div>
              )}

            </div>

            {/* Bottom Security Note */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 dark:text-slate-500">
              <div className="flex items-center gap-2 font-medium">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Secure, single-use code. Expires in 2 minutes.</span>
              </div>
              <Link href="/auth/login" className="text-emerald-700 dark:text-emerald-400 hover:underline font-bold text-[11px]">
                Sign in with Password →
              </Link>
            </div>

          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto py-4 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500 font-medium auth-footer !bg-transparent !border-transparent">
        <div>
          &copy; {new Date().getFullYear()} {brand?.name || brand?.brand_name || 'UWO Connect'} · All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
}

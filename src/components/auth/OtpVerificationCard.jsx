'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Mail, ShieldCheck, ArrowRight, ArrowLeft, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { storeUserSession } from '@/features/auth/authHelpers';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';
import { motion, AnimatePresence } from 'framer-motion';

export function maskEmail(email = '') {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) {
    return `${local[0]}***@${domain}`;
  }
  const maskedLocal = `${local.slice(0, 2)}***${local.slice(-1)}`;
  return `${maskedLocal}@${domain}`;
}

export default function OtpVerificationCard({
  email = '',
  initialOtpDebug = '',
  onBack,
  onSuccessRedirect,
  title = 'Verify Your Email Address',
  subtitle,
}) {
  const router = useRouter();
  const { brand } = useBrand();

  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [debugCode, setDebugCode] = useState(initialOtpDebug);

  const inputRefs = useRef([]);

  // Resend Countdown Timer
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [countdown]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (index, value) => {
    // Only accept numeric characters
    const cleanVal = value.replace(/\D/g, '');
    if (!cleanVal) {
      const nextOtp = [...otpValues];
      nextOtp[index] = '';
      setOtpValues(nextOtp);
      return;
    }

    const nextOtp = [...otpValues];
    // If multiple characters (pasted or fast typed)
    if (cleanVal.length > 1) {
      const chars = cleanVal.slice(0, 6).split('');
      for (let i = 0; i < 6; i++) {
        nextOtp[i] = chars[i] || '';
      }
      setOtpValues(nextOtp);
      const nextFocus = Math.min(chars.length, 5);
      inputRefs.current[nextFocus]?.focus();
      return;
    }

    nextOtp[index] = cleanVal;
    setOtpValues(nextOtp);

    // Auto-focus next box
    if (cleanVal && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      if (!otpValues[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
        const nextOtp = [...otpValues];
        nextOtp[index - 1] = '';
        setOtpValues(nextOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasteData) return;

    const nextOtp = [...otpValues];
    for (let i = 0; i < 6; i++) {
      nextOtp[i] = pasteData[i] || '';
    }
    setOtpValues(nextOtp);

    const focusIdx = Math.min(pasteData.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const fullOtp = otpValues.join('');
  const isComplete = fullOtp.length === 6;

  const handleVerify = async (e) => {
    if (e) e.preventDefault();
    if (!isComplete) {
      setError('Please enter all 6 digits of the verification code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register/verify-otp`, {
        email: email.trim().toLowerCase(),
        otp: fullOtp,
      });

      if (res.data?.status === 'APPROVED' && res.data?.token) {
        setSuccessMsg('Email verified successfully! Setting up your workspace...');
        const { token, user } = res.data;
        storeUserSession(token, user);

        setTimeout(() => {
          if (onSuccessRedirect) {
            onSuccessRedirect(user);
          } else if (user.role === 'ADMIN') {
            router.push('/admin');
          } else {
            router.push('/client');
          }
        }, 1200);
      } else {
        setError(res.data?.message || 'Verification could not be completed.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || err.message || 'Invalid verification code. Please check and try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || resending) return;

    setResending(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register/resend-otp`, {
        email: email.trim().toLowerCase(),
      });

      setSuccessMsg(res.data?.message || 'A new verification code has been sent to your email.');
      if (res.data?.otp_debug) {
        setDebugCode(res.data.otp_debug);
      }
      setCountdown(60);
      setCanResend(false);
      setOtpValues(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend OTP error:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to resend code. Please try again shortly.';
      setError(errMsg);
    } finally {
      setResending(false);
    }
  };

  const primaryColor = brand?.primary_color || '#059669';

  return (
    <div className="w-full max-w-md mx-auto p-2 sm:p-4">
      {/* Back button */}
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors mb-5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registration</span>
        </button>
      )}

      {/* Header Icon & Title */}
      <div className="text-center mb-6">
        <div 
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800/40"
          style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
        >
          <Mail className="w-7 h-7" />
        </div>

        <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {title}
        </h2>

        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
          {subtitle || (
            <>
              We sent a 6-digit verification code to
              <span className="block font-semibold text-slate-800 dark:text-slate-200 mt-1 text-sm bg-slate-100/80 dark:bg-slate-800/80 py-1 px-3 rounded-lg border border-slate-200/60 dark:border-slate-700/60 inline-block">
                {maskEmail(email)}
              </span>
            </>
          )}
        </p>
      </div>

      {/* Development Debug Banner */}
      {debugCode && (
        <div className="mb-5 p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold uppercase tracking-wider text-[10px] bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 px-1.5 py-0.5 rounded">DEV OTP</span>
            <span className="font-mono font-bold tracking-widest">{debugCode}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              const chars = debugCode.split('').slice(0, 6);
              setOtpValues(chars);
              inputRefs.current[5]?.focus();
            }}
            className="text-[11px] font-semibold text-amber-800 dark:text-amber-300 underline hover:text-amber-950 dark:hover:text-amber-100"
          >
            Auto-fill
          </button>
        </div>
      )}

      {/* Alerts */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs font-medium flex items-start gap-2.5 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-5 p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-start gap-2.5 shadow-sm"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-snug">{successMsg}</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6-Digit OTP Form */}
      <form onSubmit={handleVerify} className="space-y-6">
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-3 text-center">
            Enter 6-Digit Code
          </label>
          <div className="flex items-center justify-between gap-2 sm:gap-2.5 max-w-sm mx-auto">
            {otpValues.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                onPaste={handlePaste}
                autoComplete="one-time-code"
                className={`w-11 h-14 sm:w-12 sm:h-16 text-center text-xl sm:text-2xl font-bold rounded-xl border transition-all duration-200 outline-none select-all ${
                  digit
                    ? 'border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm ring-2 ring-emerald-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white hover:border-slate-300 dark:hover:border-slate-600 focus:bg-white dark:focus:bg-slate-800 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/15'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Verify Button */}
        <button
          type="submit"
          disabled={loading || !isComplete}
          style={{ backgroundColor: primaryColor }}
          className={`w-full py-3.5 px-4 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 ${
            loading || !isComplete
              ? 'opacity-60 cursor-not-allowed'
              : 'hover:brightness-105 active:scale-[0.99] shadow-emerald-500/25'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verifying Code...</span>
            </>
          ) : (
            <>
              <span>Verify & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Resend OTP Section */}
        <div className="pt-2 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
            Didn't receive the email? Check your spam folder or
          </p>

          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={resending}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline transition-colors"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending New Code...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Resend Verification Code</span>
                </>
              )}
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500">
              <RefreshCw className="w-3.5 h-3.5 animate-spin-reverse opacity-40" />
              <span>
                Resend code in <strong className="text-slate-600 dark:text-slate-300">{countdown}s</strong>
              </span>
            </div>
          )}
        </div>

        {/* Trust Badge */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[11px] font-semibold text-slate-400 dark:text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted 256-Bit Authentication Verification</span>
        </div>
      </form>
    </div>
  );
}

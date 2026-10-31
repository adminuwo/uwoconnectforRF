'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { Mail, ArrowRight, ArrowLeft, Loader2, AlertCircle, Sun, Moon } from 'lucide-react';
import AuthHeroSide from '@/components/auth/AuthHeroSide';
import OtpVerificationCard from '@/components/auth/OtpVerificationCard';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';
import { API_BASE_URL } from '@/config/apiConfig';

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { brand } = useBrand();
  const { isDark, toggleTheme } = useTheme();

  const initialEmail = searchParams?.get('email') || '';
  const reason = searchParams?.get('reason') || '';

  const [email, setEmail] = useState(initialEmail);
  const [emailSubmitted, setEmailSubmitted] = useState(Boolean(initialEmail));
  const [sendingOtp, setSendingOtp] = useState(false);
  const [otpDebug, setOtpDebug] = useState('');
  const [error, setError] = useState(reason === 'unverified' ? 'Please verify your email address to continue signing in.' : '');

  // If email was provided in URL query, ensure OTP has been requested or prompt user
  useEffect(() => {
    if (initialEmail && reason === 'unverified') {
      // Auto-trigger OTP send if coming from unverified login attempt
      axios.post(`${API_BASE_URL}/api/auth/register/resend-otp`, { email: initialEmail })
        .then((res) => {
          if (res.data?.otp_debug) {
            setOtpDebug(res.data.otp_debug);
          }
        })
        .catch(() => {});
    }
  }, [initialEmail, reason]);

  const handleSendInitialOtp = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    setSendingOtp(true);
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/register/resend-otp`, {
        email: email.trim().toLowerCase(),
      });

      if (res.data?.otp_debug) {
        setOtpDebug(res.data.otp_debug);
      }
      setEmailSubmitted(true);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Could not send verification code. Please check your email.');
    } finally {
      setSendingOtp(false);
    }
  };

  const primaryColor = brand?.primary_color || '#059669';

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-3 sm:p-4 bg-[#f8fafc] dark:bg-[#070B14] font-sans relative overflow-x-hidden overflow-y-auto selection:bg-emerald-500 selection:text-white py-4 sm:py-6 transition-colors duration-300">
      {/* Background Ambience */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Logo */}
      <div className="w-full max-w-5xl flex justify-between items-center py-2 px-2 z-10 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          {brand?.company_logo_url ? (
            <img
              src={brand.company_logo_url}
              alt={brand.brand_name || 'Logo'}
              className="h-9 w-auto max-w-[140px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-white shadow-md shadow-emerald-500/20"
                style={{ backgroundColor: primaryColor }}
              >
                U
              </div>
              <span className="font-extrabold text-lg text-slate-800 dark:text-white tracking-tight">
                {brand?.brand_name || 'UWO Connect'}
              </span>
            </div>
          )}
        </Link>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className="p-2 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <Link
            href="/auth/login"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <span>Sign In</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="w-full max-w-4xl bg-white dark:bg-[#0F172A] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden my-auto z-10 transition-colors">
        {/* Left Hero Side */}
        <AuthHeroSide
          title={<>One step away <br />from your workspace.</>}
          subtitle="Verify your registered email address to activate your account and start automating your business."
          badgeText="Verified • Protected • Fast"
        />

        {/* Right Form Card */}
        <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center items-center bg-white dark:bg-[#0F172A] transition-colors">
          {emailSubmitted ? (
            <OtpVerificationCard
              email={email}
              initialOtpDebug={otpDebug}
              onBack={() => setEmailSubmitted(false)}
            />
          ) : (
            <div className="w-full max-w-md mx-auto">
              <div className="text-center mb-6">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-emerald-100 dark:border-emerald-800/40"
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                >
                  <Mail className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                  Verify Your Account
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Enter your registered email address below to receive a 6-digit verification code.
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="leading-snug">{error}</div>
                </div>
              )}

              <form onSubmit={handleSendInitialOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sendingOtp || !email}
                  style={{ backgroundColor: primaryColor }}
                  className="w-full py-3.5 px-4 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:brightness-105 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {sendingOtp ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Verification Code...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Verification Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="pt-4 text-center border-t border-slate-100 dark:border-slate-800">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Already verified?{' '}
                    <Link href="/auth/login" className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                      Log In
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* Footer Notice */}
      <div className="py-2 text-center text-slate-400 dark:text-slate-500 text-xs z-10 shrink-0 auth-footer !bg-transparent !border-transparent">
        &copy; {new Date().getFullYear()} {brand?.brand_name || 'UWO Connect'}. All rights reserved.
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}

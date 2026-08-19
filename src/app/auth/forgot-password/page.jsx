'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, KeyRound, ShieldCheck, Lock, ArrowLeft, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

  // Step 1: Send OTP to Email
  const handleSendOTP = async (e) => {
    if (e) e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password/send-otp`, { email });
      setSuccessMsg(res.data?.message || 'OTP code sent to your email.');
      setStep(2);
    } catch (err) {
      console.error('Send OTP error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-Digit OTP Code
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setError('Please enter valid 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password/verify-otp`, { email, otp });
      setSuccessMsg(res.data?.message || 'OTP verified successfully.');
      setStep(3);
    } catch (err) {
      console.error('Verify OTP error:', err);
      setError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Set New Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(`${baseUrl}/api/auth/forgot-password/reset`, { email, password: newPassword });
      setSuccessMsg(res.data?.message || 'Password updated successfully!');
      setStep(4);
    } catch (err) {
      console.error('Reset Password error:', err);
      setError(err.response?.data?.message || 'Failed to update password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#edf7f0] font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Dynamic ambient background glow circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[350px] h-[350px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-[440px] z-10 bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[32px] p-6 sm:p-9 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.15),0_0_20px_rgba(255,255,255,0.8)_inset] flex flex-col items-center transition-all">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-6 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-sm">
          <img 
            src="/download (3).gif" 
            alt="UwoConnect Logo" 
            className="w-5 h-5 rounded-full object-contain"
          />
          <span className="text-emerald-900 font-bold text-xs tracking-wider uppercase">
            UwoConnect
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 p-3.5 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200/80 flex items-start gap-2.5 animate-in fade-in duration-200 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && step !== 4 && (
          <div className="w-full mb-4 p-3.5 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-2xl border border-emerald-200/80 flex items-start gap-2.5 animate-in fade-in duration-200 shadow-sm">
            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{successMsg}</div>
          </div>
        )}

        <div className="w-full">
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div>
              <div className="text-center mb-6">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">
                  Reset Password
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Enter your email to receive a 6-digit verification code
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 ml-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-3 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white w-5 h-5" />
                  ) : (
                    <>
                      <span>Send OTP Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <ShieldCheck size={24} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Enter Verification Code
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  We sent a 6-digit code to <strong className="text-slate-800">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-300 outline-none rounded-2xl py-3 px-6 text-center font-extrabold text-2xl tracking-[10px] border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white w-5 h-5" />
                  ) : (
                    <>
                      <span>Verify Code</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex justify-between items-center text-xs pt-1 px-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-800 font-bold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <ArrowLeft size={14} /> Change Email
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSendOTP()}
                    disabled={loading}
                    className="text-emerald-700 hover:text-emerald-800 font-bold underline cursor-pointer transition-colors"
                  >
                    Resend Code
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
                  <Lock size={24} />
                </div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                  Set New Password
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm font-medium">
                  Create a strong new password for your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 ml-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <Loader2 className="animate-spin text-white w-5 h-5" />
                  ) : (
                    <>
                      <span>Update Password</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success Message */}
          {step === 4 && (
            <div className="text-center py-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
                <Check size={32} />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Password Updated!</h2>
              <p className="text-slate-500 mb-6 text-xs sm:text-sm font-medium">
                Your password has been reset successfully. You can now sign in with your new password.
              </p>
              <Link 
                href="/auth/login" 
                className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all text-center"
              >
                <span>Go to Login</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="mt-6 text-center">
            <p className="text-xs font-semibold text-slate-500">
              Remember your password?{' '}
              <Link 
                href="/auth/login" 
                className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all"
              >
                Log In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

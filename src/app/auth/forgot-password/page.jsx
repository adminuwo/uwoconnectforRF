'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, Loader2, ArrowRight, Check, Sparkles, Eye, EyeOff, KeyRound } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/forgot-password/send-otp`, { email });
      setMessage(res.data.message);
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please check your email.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/forgot-password/verify-otp`, { email, otp });
      setMessage(res.data.message);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/forgot-password/reset`, { email, password });
      setMessage(res.data.message);
      setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#10B981]/20 selection:text-[#1F2937] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs/glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#DCFCE7]/40 blur-[130px]"
        />
        <div
          className="absolute -bottom-[10%] right-[10%] w-[55%] h-[55%] rounded-full bg-[#BBF7D0]/30 blur-[120px]"
        />
      </div>

      <div className="w-full max-w-[440px] z-10 flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#16A34A] to-[#059669] flex items-center justify-center shadow-md shadow-emerald-100">
            <Sparkles className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[#1F2937] font-bold text-xl tracking-tight">
            Meta Connect
          </span>
        </div>

        {/* WhatsApp Icon with green ambient glow */}
        <div className="w-16 h-16 rounded-full bg-[#059669] flex items-center justify-center shadow-lg shadow-emerald-100/50 mb-8 border border-white/20">
          <svg className="w-9 h-9 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.004 2C6.51 2 2.014 6.5 2.014 12c0 2.18.7 4.21 2.006 5.85L2.3 22.06l4.35-1.12c1.61 1.05 3.51 1.66 5.35 1.66 5.5 0 9.996-4.5 9.996-10S17.504 2 12.004 2zm5.79 13.92c-.25.7-1.46 1.3-2.01 1.4-1.31.25-3.01-.25-4.81-1.01-3.01-1.26-4.96-4.31-5.11-4.51-.15-.2-1.2-1.61-1.2-3.07 0-1.46.75-2.17 1.01-2.47.25-.3.55-.4.75-.4s.4 0 .55.1c.15.1.4.4.45.55.05.15.2.45.2.65 0 .2-.1.4-.2.55s-.2.25-.35.45c-.15.15-.3.3-.45.45-.15.15-.05.45.15.75.45.75 1.05 1.4 1.8 1.95.75.55 1.55.95 2.45 1.15.3.05.55 0 .75-.25.2-.25.55-.65.75-.95.2-.3.35-.25.6-.15s1.6.75 1.9.9.5.25.55.35c.1.1.1.6-.15 1.3z" />
          </svg>
        </div>

        {/* Card */}
        <div className="w-full bg-white/60 backdrop-blur-[24px] border border-[#16A34A]/15 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(16,185,129,0.03)] shadow-emerald-950/[0.01] transition-all duration-300 relative overflow-hidden">
          {/* Top Shine */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BBF7D0]/40 to-transparent" />

          {error && (
            <div className="mb-6 p-4 bg-rose-50 text-rose-600 text-xs font-bold rounded-2xl border border-rose-100/80">
              {error}
            </div>
          )}

          {message && !error && (
            <div className="mb-6 p-4 bg-emerald-50 text-[#059669] text-xs font-bold rounded-2xl border border-emerald-100/80">
              {message}
            </div>
          )}

          
            {step === 1 && (
              <div
                key="step1"
              >
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Forgot Password</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2 text-center">Enter your email to receive an OTP code.</p>
                </div>

                <form onSubmit={handleSendOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#16A34A] transition-colors" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-6 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full rounded-2xl py-3.5 px-6 text-white font-bold text-[12px] uppercase tracking-wider overflow-hidden group shadow-lg shadow-emerald-100 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#059669] group-hover:opacity-95 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      {loading ? <Loader2 className="animate-spin text-white" size={18} /> : (
                        <>Send OTP <ArrowRight size={16} strokeWidth={3} className="text-white" /></>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {step === 2 && (
              <div
                key="step2"
              >
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Verify Email</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2 text-center">We sent a 6-digit OTP code to {email}</p>
                </div>

                <form onSubmit={handleVerifyOtp} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">OTP Code</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <KeyRound className="h-4 w-4 text-slate-400 group-focus-within:text-[#16A34A] transition-colors" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="123456"
                        className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-6 text-center tracking-[0.5em] font-bold text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 text-sm shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full rounded-2xl py-3.5 px-6 text-white font-bold text-[12px] uppercase tracking-wider overflow-hidden group shadow-lg shadow-emerald-100 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#059669] group-hover:opacity-95 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      {loading ? <Loader2 className="animate-spin text-white" size={18} /> : (
                        <>Verify OTP <ArrowRight size={16} strokeWidth={3} className="text-white" /></>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {step === 3 && (
              <div
                key="step3"
              >
                <div className="flex flex-col items-center mb-8">
                  <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Reset Password</h2>
                  <p className="text-slate-500 text-sm font-medium mt-2 text-center">Choose a secure new password.</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#16A34A] transition-colors" />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-12 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-[#16A34A] transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="relative w-full rounded-2xl py-3.5 px-6 text-white font-bold text-[12px] uppercase tracking-wider overflow-hidden group shadow-lg shadow-emerald-100 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#16A34A] to-[#059669] group-hover:opacity-95 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-2 text-white">
                      {loading ? <Loader2 className="animate-spin text-white" size={18} /> : (
                        <>Reset Password <ArrowRight size={16} strokeWidth={3} className="text-white" /></>
                      )}
                    </span>
                  </button>
                </form>
              </div>
            )}

            {step === 4 && (
              <div
                key="step4"
                className="text-center"
              >
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#059669] border border-emerald-100 shadow-sm">
                  <Check size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#1F2937] mb-2">Success!</h2>
                <p className="text-slate-500 mb-8 leading-relaxed text-sm font-medium">
                  Your password has been reset successfully. You can now log in using your new password.
                </p>
                <Link href="/auth/login" className="block w-full py-4 bg-gradient-to-r from-[#16A34A] to-[#059669] text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-md">
                  Back to Login
                </Link>
              </div>
            )}
          

          {step < 4 && (
            <div className="mt-8 text-center border-t border-slate-100 pt-6">
              <p className="text-xs font-semibold text-slate-500">
                Remember your password? <Link href="/auth/login" className="text-[#16A34A] hover:text-[#14532D] font-bold transition-colors">Log In</Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;



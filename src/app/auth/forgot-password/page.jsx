'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, Sparkles } from 'lucide-react';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background organic blur circles for glassmorphism to pop */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[440px] z-10 bg-white/80 backdrop-blur-[24px] border border-white/50 rounded-[40px] p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-8 bg-white/20 px-6 py-2.5 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
          <div className="w-9 h-9 rounded-full bg-[#45724c] flex items-center justify-center shadow-md">
            <Sparkles className="text-white animate-pulse" size={16} strokeWidth={2.5} />
          </div>
          <span className="text-[#2f593b] font-black text-lg tracking-tight uppercase">
            AisaConnect
          </span>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50/80 text-red-600 text-xs font-bold rounded-[24px] border border-red-100 text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {message && !error && (
          <div className="w-full mb-6 p-4 bg-emerald-50/80 text-emerald-800 text-xs font-bold rounded-[24px] border border-emerald-100 text-center animate-in fade-in duration-300">
            {message}
          </div>
        )}

        <div className="w-full">
          {step === 1 && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-[#2f593b] tracking-tight leading-none mb-3">
                  Forgot Password
                </h1>
                <p className="text-[#5d7c66] text-xs font-bold uppercase tracking-widest italic">
                  Enter email to get OTP
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="space-y-6">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="username@mail.com"
                  className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Send OTP'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-[#2f593b] tracking-tight leading-none mb-3">
                  Verify Email
                </h1>
                <p className="text-[#5d7c66] text-xs font-bold uppercase tracking-widest italic">
                  Enter 6-digit OTP code
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="OTP Code"
                  className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893] text-center tracking-[0.2em]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Verify OTP'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-4xl font-black text-[#2f593b] tracking-tight leading-none mb-3">
                  Reset Password
                </h1>
                <p className="text-[#5d7c66] text-xs font-bold uppercase tracking-widest italic">
                  Choose a new password
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New Password"
                  className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Reset Password'}
                </button>
              </form>
            </div>
          )}

          {step === 4 && (
            <div className="text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 text-[#2f593b] shadow-md animate-bounce">
                <Check size={32} />
              </div>
              <h2 className="text-3xl font-black text-[#2f593b] mb-2">Success!</h2>
              <p className="text-[#5d7c66] mb-8 text-sm font-semibold italic">
                Your password has been reset successfully.
              </p>
              <Link href="/auth/login" className="block w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all text-center">
                Back to Login
              </Link>
            </div>
          )}
        </div>

        {step < 4 && (
          <div className="mt-10 text-center">
            <p className="text-xs font-bold text-[#5d7c66]">
              Remember your password? <Link href="/auth/login" className="text-[#2f593b] font-black underline">Log In</Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

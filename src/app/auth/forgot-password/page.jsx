'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, KeyRound, ShieldCheck, Lock, ArrowLeft } from 'lucide-react';
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
    e.preventDefault();
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
    <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background organic blur circles */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[420px] z-10 bg-white/80 backdrop-blur-[24px] border border-white/50 rounded-[36px] p-6 sm:py-7 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 mb-5 bg-white/20 px-5 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
          <img 
            src="/download (3).gif" 
            alt="UwoConnect Logo" 
            className="w-7 h-7 rounded-full object-contain shadow-md"
          />
          <span className="text-[#2f593b] font-black text-base tracking-tight uppercase">
            UwoConnect
          </span>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50/90 text-red-600 text-xs font-bold rounded-[20px] border border-red-100 text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {successMsg && step !== 4 && (
          <div className="w-full mb-4 p-3 bg-emerald-50/90 text-emerald-700 text-xs font-bold rounded-[20px] border border-emerald-200 text-center animate-in fade-in duration-300">
            {successMsg}
          </div>
        )}

        <div className="w-full">
          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <div>
              <div className="text-center mb-5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#2f593b] tracking-tight leading-none mb-1.5">
                  Forgot Password
                </h1>
                <p className="text-[#5d7c66] text-[10px] font-bold uppercase tracking-widest italic">
                  Enter email to receive 6-digit OTP
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-3.5">
                <div>
                  <label className="text-xs font-bold text-[#2f593b] mb-1.5 block px-3">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="username@mail.com"
                    className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 px-6 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Send OTP Code'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === 2 && (
            <div>
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck size={24} />
                </div>
                <h1 className="text-2xl font-black text-[#2f593b] tracking-tight leading-none mb-1.5">
                  Enter OTP Code
                </h1>
                <p className="text-[#5d7c66] text-[11px] font-bold italic">
                  Enter 6-digit code sent to <strong className="text-[#2f593b]">{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-3.5">
                <div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 px-6 text-center font-black text-xl tracking-[8px] transition-all shadow-inner focus:bg-[#8ca893]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Verify OTP'}
                </button>

                <div className="flex justify-between items-center text-xs pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[#5d7c66] hover:text-[#2f593b] font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft size={14} /> Change Email
                  </button>

                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-[#2f593b] font-black underline cursor-pointer"
                  >
                    Resend OTP
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* STEP 3: Reset Password */}
          {step === 3 && (
            <div>
              <div className="text-center mb-5">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Lock size={24} />
                </div>
                <h1 className="text-2xl font-black text-[#2f593b] tracking-tight leading-none mb-1.5">
                  Set New Password
                </h1>
                <p className="text-[#5d7c66] text-[10px] font-bold uppercase tracking-widest italic">
                  Create a new strong password for your account
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-[#2f593b] mb-1 block px-3">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 px-6 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#2f593b] mb-1 block px-3">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 px-6 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98] mt-2"
                >
                  {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Success Message */}
          {step === 4 && (
            <div className="text-center py-2">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md animate-bounce">
                <Check size={28} />
              </div>
              <h2 className="text-2xl font-black text-[#2f593b] mb-1.5">Password Updated!</h2>
              <p className="text-[#5d7c66] mb-6 text-sm font-semibold italic">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link 
                href="/auth/login" 
                className="block w-full py-3 bg-[#45724c] hover:bg-[#3b6342] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all text-center active:scale-[0.98] shadow-md"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>

        {step === 1 && (
          <div className="mt-4 text-center">
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

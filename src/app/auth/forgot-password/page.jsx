'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Loader2, Check, KeyRound, ShieldCheck, Lock, ArrowLeft, Mail, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { motion } from 'framer-motion';
import AuthHeroSide from '@/components/auth/AuthHeroSide';
import { useBrand } from '@/context/BrandContext';
import PasswordStrengthIndicator from '@/components/auth/PasswordStrengthIndicator';
import { evaluatePassword } from '@/lib/passwordValidation';

const ForgotPasswordPage = () => {
  const { brand } = useBrand();
  const [step, setStep] = useState(1); // 1: Send OTP, 2: Verify OTP, 3: Reset Password, 4: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [debugOtp, setDebugOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';

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
      // Dev mode auto-fill removed
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
    const evaluation = evaluatePassword(newPassword);
    if (!evaluation.isValid) {
      setError('Password does not meet all security requirements. Please fulfill all criteria below.');
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
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 bg-[#f8fafc] font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white py-6">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] opacity-50" />

      {/* Top Brand Header */}
      <header className="relative z-20 w-full max-w-6xl mx-auto pt-2 pb-2 px-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {brand?.logo_url && brand.logo_url !== "/download (3).gif" ? (
            <img src={brand.logo_url} alt="Logo" className="w-11 h-11 object-contain rounded-full shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] border-[1.5px] border-emerald-100 shrink-0">
              <img src="/uwo-icon.png" alt="UWO Connect Logo" className="w-full h-full object-contain p-1.5" />
            </div>
          )}
          <span className="font-extrabold text-slate-900 tracking-tight text-xl drop-shadow-sm group-hover:text-emerald-700 transition-colors">
            {brand?.brand_name || brand?.name || "UWO Connect"}
          </span>
        </Link>

        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xs hover:shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Split Card */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[1000px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row overflow-hidden relative z-10 my-auto"
        >
          {/* Left Side: Abha & Dev Hero */}
          <AuthHeroSide
            imageSrc="/abha_dev_forgot.png"
            title={<>Account recovery <br/> made simple & safe.</>}
            subtitle="Reset your password in a few quick steps with OTP verification and get back to automating your workflows."
            badgeText="Encrypted • Verified • Protected"
          />

          {/* Right Side: Reset Flow */}
          <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white relative">

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
                      type={showNewPassword ? "text" : "password"}
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-11 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      aria-label={showNewPassword ? "Hide password" : "Show password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showNewPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 ml-1">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-11 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {/* Password Strength Indicator & Real-Time Checklist */}
                <PasswordStrengthIndicator 
                  password={newPassword}
                  confirmPassword={confirmPassword}
                  showChecklist={true}
                />

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
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
        <div>
          &copy; {new Date().getFullYear()} {brand?.brand_name || brand?.name || 'UWO Connect'} · All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Use (EULA)</Link>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">Support</Link>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPasswordPage;

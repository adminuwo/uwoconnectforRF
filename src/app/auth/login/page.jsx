'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import axios from 'axios';
import UWOLoginModal from '@/components/UWOLoginModal';
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  signInWithPopup,
} from '@/lib/firebase';
import { storeUserSession } from '@/features/auth/authHelpers';
import { API_BASE_URL } from '@/config/apiConfig';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingProvider, setLoadingProvider] = useState(null); // 'email' | 'google' | 'github' | 'facebook' | null
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showUWOModal, setShowUWOModal] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = API_BASE_URL;

  const handleBackendAuth = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    const res = await axios.post(`${API_URL}/api/auth/firebase-login`, {
      id_token: idToken,
    });

    if (res.status === 201) {
      setError(res.data.message || 'Successfully registered. Waiting for admin approval.');
      setLoadingProvider(null);
      return;
    }

    const { token, user } = res.data;
    storeUserSession(token, user);

    if (user.role === 'CLIENT' && !localStorage.getItem('aisa_tour_completed')) {
      localStorage.setItem('aisa_tour_pending', 'true');
      localStorage.removeItem('aisa_tour_step');
    }

    if (user.role === 'ADMIN') {
      router.push('/admin');
    } else {
      router.push('/client');
    }
  };

  const parseAuthError = (err, providerName = 'Social') => {
    if (err?.code === 'auth/popup-closed-by-user') {
      return `${providerName} Sign-In was cancelled.`;
    }
    if (err?.code === 'auth/popup-blocked' || err?.message?.includes('popup-blocked')) {
      return 'Pop-up was blocked by your browser. Please allow pop-ups for this site in your browser address bar and try again.';
    }
    if (err?.code === 'auth/cancelled-popup-request') {
      return 'Sign-in attempt was interrupted. Please try again.';
    }
    if (err?.response?.data?.message) {
      return err.response.data.message;
    }
    return err?.message || `${providerName} authentication failed.`;
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoadingProvider('google');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Google login error:', err);
      setError(parseAuthError(err, 'Google'));
      setLoadingProvider(null);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setLoadingProvider('github');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Github login error:', err);
      setError(parseAuthError(err, 'GitHub'));
      setLoadingProvider(null);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoadingProvider('facebook');
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Facebook login error:', err);
      setError(parseAuthError(err, 'Facebook'));
      setLoadingProvider(null);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoadingProvider('email');
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
      });

      const { token, user } = res.data;
      storeUserSession(token, user);

      if (user.role === 'CLIENT' && !localStorage.getItem('aisa_tour_completed')) {
        localStorage.setItem('aisa_tour_pending', 'true');
        localStorage.removeItem('aisa_tour_step');
      }

      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    } catch (err) {
      console.error('Login error:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Invalid email or password. Please check your credentials.');
      }
    } finally {
      setLoadingProvider(null);
    }
  };

  const isAnyLoading = loadingProvider !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e8f7ee] via-[#f4faf6] to-[#def3e7] font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Dynamic Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 w-[450px] h-[450px] bg-emerald-400/25 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-teal-400/25 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-200/20 rounded-full blur-[160px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#059669 1.5px, transparent 1.5px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Main Glass Card */}
      <motion.div
        initial={{ opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="w-full max-w-[430px] z-10 bg-white/95 backdrop-blur-2xl border border-white/90 rounded-[28px] p-6 sm:p-8 shadow-[0_20px_60px_-15px_rgba(5,150,105,0.18),0_0_20px_rgba(255,255,255,0.85)_inset] flex flex-col items-center relative"
      >
        {/* Brand Header */}
        <div className="flex items-center gap-2 mb-4 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/70 shadow-xs">
          <img
            src="/download (3).gif"
            alt="UwoConnect Logo"
            className="w-5 h-5 rounded-full object-contain"
          />
          <span className="text-emerald-900 font-extrabold text-xs tracking-wider uppercase">
            UwoConnect
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-5 w-full">
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-0.5 font-medium">
            Sign in to access your automation workspace
          </p>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              className="w-full mb-4 overflow-hidden"
            >
              <div className="p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200 flex items-start gap-2.5 shadow-xs">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1 leading-relaxed">{error}</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailLogin} className="w-full space-y-3.5">
          {/* Email Field */}
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
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/90 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700 ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-11 font-medium text-sm border border-slate-200/90 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-2xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-lg focus:outline-none cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1 pt-0.5">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span>Remember me</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-emerald-700 hover:text-emerald-800 hover:underline font-bold transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isAnyLoading}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-md shadow-emerald-600/25 hover:shadow-lg hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === 'email' ? (
                <Loader2 className="animate-spin text-white w-4 h-4" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-4">
          <div className="h-[1px] bg-slate-200/90 flex-1" />
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="h-[1px] bg-slate-200/90 flex-1" />
        </div>

        {/* UWO SSO & Social Login Stack */}
        <div className="w-full space-y-2">
          {/* UWO Single Sign-On Button */}
          <button
            type="button"
            disabled={isAnyLoading}
            onClick={() => setShowUWOModal(true)}
            title="Sign in with Unified Web Options (UWO SSO)"
            className="w-full py-2.5 px-4 bg-gradient-to-r from-[#102216] via-[#1a3a25] to-[#102216] hover:from-[#0d1d13] hover:to-[#15321f] text-white rounded-2xl flex items-center justify-center gap-2 shadow-sm border border-emerald-500/30 hover:border-emerald-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer font-bold text-xs tracking-wider uppercase disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sign In with UWO SSO</span>
          </button>

          {/* Social Logins: Google, GitHub, Facebook */}
          <div className="grid grid-cols-3 gap-2">
            {/* Google */}
            <button
              type="button"
              disabled={isAnyLoading}
              onClick={handleGoogleLogin}
              title="Continue with Google"
              className="h-10 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-300 rounded-2xl flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === 'google' ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-700" />
              ) : (
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
              )}
            </button>

            {/* GitHub */}
            <button
              type="button"
              disabled={isAnyLoading}
              onClick={handleGithubLogin}
              title="Continue with GitHub"
              className="h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === 'github' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
              )}
            </button>

            {/* Facebook */}
            <button
              type="button"
              disabled={isAnyLoading}
              onClick={handleFacebookLogin}
              title="Continue with Facebook"
              className="h-10 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl flex items-center justify-center shadow-2xs hover:shadow-xs transition-all cursor-pointer group active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loadingProvider === 'facebook' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <svg className="w-4 h-4 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Toggle to register */}
        <div className="mt-5 text-center">
          <p className="text-xs font-semibold text-slate-500">
            Don't have an account?{' '}
            <Link
              href="/auth/register"
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all"
            >
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>

      {/* Security badge footer */}
      <div className="mt-5 flex items-center gap-2 text-[11px] font-semibold text-emerald-900/60 z-10 select-none">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
        <span>Enterprise-grade security • SOC2 Certified</span>
      </div>

      {/* UWO Single Sign-On Modal */}
      <UWOLoginModal
        isOpen={showUWOModal}
        onClose={() => setShowUWOModal(false)}
        onSuccess={(uwoData) => {
          if (uwoData?.user) {
            if (uwoData.user.role === 'CLIENT' && !localStorage.getItem('aisa_tour_completed')) {
              localStorage.setItem('aisa_tour_pending', 'true');
              localStorage.removeItem('aisa_tour_step');
            }

            if (uwoData.user.role === 'ADMIN') {
              router.push('/admin');
            } else {
              router.push('/client');
            }
          }
        }}
      />
    </div>
  );
};

export default LoginPage;

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from '@/lib/firebase';
import { storeUserSession } from '@/lib/authHelpers';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

  /**
   * After Firebase sign-in, send the ID token to the backend
   * to get user role, client info, etc.
   */
  const handleBackendAuth = async (firebaseUser) => {
    const idToken = await firebaseUser.getIdToken();
    const res = await axios.post(`${API_URL}/api/auth/firebase-login`, {
      id_token: idToken,
    });

    if (res.status === 201) {
      // Newly registered, waiting for approval
      setError(res.data.message || 'Successfully registered. Waiting for admin approval.');
      setLoading(false);
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

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Google login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Google Login was cancelled.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Google authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Github login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Github Login was cancelled.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Github authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleBackendAuth(result.user);
    } catch (err) {
      console.error('Facebook login error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Facebook Login was cancelled.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Facebook authentication failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      await handleBackendAuth(userCredential.user);
    } catch (err) {
      console.error('Login error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please try again later.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background organic blur circles for glassmorphism to pop */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 bg-white/80 backdrop-blur-[24px] border border-white/50 rounded-[36px] p-5 sm:py-6 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 mb-4 bg-white/20 px-5 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#45724c] flex items-center justify-center shadow-md">
            <Sparkles className="text-white animate-pulse" size={13} strokeWidth={2.5} />
          </div>
          <span className="text-[#2f593b] font-black text-base tracking-tight uppercase">
            UwoConnect
          </span>
        </div>

        {/* Title Section */}
        <div className="text-center mb-5">
          <h1 className="text-3xl font-black text-[#2f593b] tracking-tight leading-none mb-1.5">
            Login
          </h1>
          <p className="text-[#5d7c66] text-[10px] font-bold uppercase tracking-widest italic">
            Access your account
          </p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50/80 text-red-600 text-xs font-bold rounded-[24px] border border-red-100 text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-3.5">
          <div className="space-y-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@mail.com"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 px-7 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-3 pl-7 pr-12 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4d6a54] hover:text-[#2f593b] transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Remember me & Forgot Password */}
          <div className="flex items-center justify-between px-2 text-[#2f593b] text-xs font-black">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <div className="relative w-4.5 h-4.5 rounded-full border-2 border-[#2f593b] flex items-center justify-center transition-all bg-transparent">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                {rememberMe && <div className="w-2 h-2 rounded-full bg-[#2f593b]" />}
              </div>
              <span className="opacity-90">Remember me</span>
            </label>
            <Link href="/auth/forgot-password" className="hover:underline transition-all">
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Login'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-4">
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
          <span className="text-[#2f593b] text-[10px] font-black uppercase tracking-wider">Or continue with</span>
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
        </div>

        {/* Social logins */}
        <div className="flex items-center justify-center gap-4">
          <button onClick={handleGoogleLogin} className="w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-5 h-5 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.78 0-8.67-3.89-8.67-8.67s3.89-8.67 8.67-8.67c2.14 0 4.09.78 5.61 2.07l3.22-3.22C18.3 1.34 15.42 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.9 0 11.5-4.86 11.5-11.7 0-.79-.07-1.56-.2-2.3H12.24z"/>
            </svg>
          </button>
          <button onClick={handleFacebookLogin} className="w-11 h-11 bg-[#1877F2] rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button onClick={handleGithubLogin} className="w-11 h-11 bg-slate-900 rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </button>
        </div>

        {/* Toggle to register */}
        <div className="mt-4 text-center">
          <p className="text-xs font-bold text-[#5d7c66]">
            Don't have an account? <Link href="/auth/register" className="text-[#2f593b] font-black underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

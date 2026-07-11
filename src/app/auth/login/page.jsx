'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, Check, Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [googleClientId, setGoogleClientId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchGoogleClientId = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/google-client-id`);
        setGoogleClientId(res.data.client_id);
      } catch (err) {
        console.error('Failed to fetch Google Client ID from backend');
      }
    };
    fetchGoogleClientId();
  }, []);

  const handleGoogleLogin = () => {
    if (typeof window === 'undefined' || !window.google) {
      setError('Google auth library is not loaded yet. Please wait a moment.');
      return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        scope: "https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/google-login`, {
                access_token: tokenResponse.access_token
              });
              
              if (res.status === 201) {
                setError(res.data.message || 'Successfully registered. Waiting for admin approval.');
                setLoading(false);
                return;
              }

              const { token, user } = res.data;
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));

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
              setError(err.response?.data?.message || 'Google authentication failed.');
              setLoading(false);
            }
          } else {
            setError('Google Login was cancelled or failed.');
            setLoading(false);
          }
        },
      });
      client.requestAccessToken();
    } catch (e) {
      console.error(e);
      setError('Failed to initialize Google Sign-In.');
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/login`, {
        email,
        password
      });
      const { token, user } = res.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

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
      setError(err.response?.data?.message || 'Invalid credentials or connection error.');
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

        {/* Title Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-[#2f593b] tracking-tight leading-none mb-3">
            Login
          </h1>
          <p className="text-[#5d7c66] text-xs font-bold uppercase tracking-widest italic">
            Access your account
          </p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50/80 text-red-600 text-xs font-bold rounded-[24px] border border-red-100 text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-1">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="username@mail.com"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 pl-8 pr-12 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
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
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Login'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-10">
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
          <span className="text-[#2f593b] text-xs font-black uppercase tracking-wider">Or continue with</span>
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
        </div>

        {/* Social logins */}
        <div className="flex items-center justify-center">
          <button onClick={handleGoogleLogin} className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.78 0-8.67-3.89-8.67-8.67s3.89-8.67 8.67-8.67c2.14 0 4.09.78 5.61 2.07l3.22-3.22C18.3 1.34 15.42 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.9 0 11.5-4.86 11.5-11.7 0-.79-.07-1.56-.2-2.3H12.24z"/>
            </svg>
          </button>
        </div>

        {/* Toggle to register */}
        <div className="mt-10 text-center">
          <p className="text-xs font-bold text-[#5d7c66]">
            Don't have an account? <Link href="/auth/register" className="text-[#2f593b] font-black underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

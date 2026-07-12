'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, Clock, Sparkles, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import TermsModal from '@/components/TermsModal';

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get('invite_token');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    password: '',
    invite_token: inviteToken || ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    if (!termsAccepted) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }

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
                access_token: tokenResponse.access_token,
                invite_token: inviteToken
              });
              
              if (res.status === 201) {
                setSuccess(true);
                setLoading(false);
                return;
              }

              const { token, user } = res.data;
              localStorage.setItem('token', token);
              localStorage.setItem('user', JSON.stringify(user));

              if (user.role !== 'ADMIN' && !localStorage.getItem('aisa_tour_completed')) {
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

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('You must agree to the Terms and Privacy Policy.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/register`, formData);
      setSuccess(true);
    } catch (err) {
      if (err.response?.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          // Handle DRF ValidationError dictionary
          const firstErrorKey = Object.keys(err.response.data)[0];
          const firstErrorVal = err.response.data[firstErrorKey];
          setError(Array.isArray(firstErrorVal) ? firstErrorVal[0] : firstErrorVal);
        }
      } else {
        setError('Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        <div className="bg-white/90 backdrop-blur-[24px] border border-emerald-100 p-10 rounded-[32px] shadow-xl max-w-md w-full text-center z-10 animate-in fade-in zoom-in duration-300">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#059669]">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Waiting for Approval</h2>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm font-semibold">
            Your registration is currently pending review by our administrator. We will notify you once your account has been approved.
          </p>
          <Link href="/auth/login" className="block w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-4 sm:p-6 select-none relative overflow-hidden">
      {/* Background organic blur circles for glassmorphism to pop */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-[400px] z-10 bg-white/80 backdrop-blur-[24px] border border-white/50 rounded-[36px] p-5 sm:py-5 sm:px-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center">
        {/* Brand Logo */}
        <div className="flex items-center gap-2.5 mb-4 bg-white/20 px-5 py-2 rounded-full border border-white/30 backdrop-blur-sm shadow-sm">
          <div className="w-7 h-7 rounded-full bg-[#45724c] flex items-center justify-center shadow-md">
            <Sparkles className="text-white animate-pulse" size={13} strokeWidth={2.5} />
          </div>
          <span className="text-[#2f593b] font-black text-base tracking-tight uppercase">
            AisaConnect
          </span>
        </div>

        {/* Title Section */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-black text-[#2f593b] tracking-tight leading-none mb-1">
            Register
          </h1>
          <p className="text-[#5d7c66] text-[10px] font-bold uppercase tracking-widest italic">
            Create your account
          </p>
        </div>

        {error && (
          <div className="w-full mb-4 p-3 bg-red-50/80 text-red-600 text-xs font-bold rounded-[20px] border border-red-100 text-center animate-in fade-in duration-300">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full space-y-2.5">
          <div className="space-y-1">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Your Name"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-2.5 px-7 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          {!inviteToken && (
            <div className="space-y-1">
              <input
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Business Name"
                className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-2.5 px-7 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
              />
            </div>
          )}

          <div className="space-y-1">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="username@mail.com"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-2.5 px-7 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1 relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-2.5 pl-7 pr-12 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[#4d6a54] hover:text-[#2f593b] transition-colors focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start gap-3 px-1.5 text-[#2f593b] text-xs font-black select-none leading-relaxed">
            <label className="flex items-center gap-2.5 cursor-pointer mt-0.5 shrink-0">
              <div className="relative w-4 h-4 rounded-full border-2 border-[#2f593b] flex items-center justify-center transition-all bg-transparent">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                {termsAccepted && <div className="w-2 h-2 rounded-full bg-[#2f593b]" />}
              </div>
            </label>
            <span className="opacity-90">
              I agree to the{' '}
              <button type="button" onClick={() => setShowTerms(true)} className="underline hover:text-[#1c3824] cursor-pointer">
                Terms of Service
              </button>{' '}
              and{' '}
              <Link href="/privacy" className="underline hover:text-[#1c3824]">
                Privacy Policy
              </Link>
            </span>
          </div>

          {/* Register Button */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Sign Up'}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-3">
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
          <span className="text-[#2f593b] text-[10px] font-black uppercase tracking-wider">Or continue with</span>
          <div className="h-[1px] bg-[#2f593b]/20 flex-1" />
        </div>

        {/* Social logins */}
        <div className="flex items-center justify-center">
          <button onClick={handleGoogleLogin} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-5 h-5 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.78 0-8.67-3.89-8.67-8.67s3.89-8.67 8.67-8.67c2.14 0 4.09.78 5.61 2.07l3.22-3.22C18.3 1.34 15.42 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.9 0 11.5-4.86 11.5-11.7 0-.79-.07-1.56-.2-2.3H12.24z"/>
            </svg>
          </button>
        </div>

        {/* Toggle to login */}
        <div className="mt-3 text-center">
          <p className="text-xs font-bold text-[#5d7c66]">
            Already have an account? <Link href="/auth/login" className="text-[#2f593b] font-black underline">Log In</Link>
          </p>
        </div>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
};

export default RegisterPage;

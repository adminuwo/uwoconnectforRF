'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, CheckCircle2, Clock, Sparkles } from 'lucide-react';
import axios from 'axios';
import TermsModal from '@/components/TermsModal';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    businessName: '',
    password: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const router = useRouter();

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
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        <div className="bg-white/90 backdrop-blur-[24px] border border-emerald-100 p-10 rounded-[32px] shadow-xl max-w-md w-full text-center z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#059669]">
            <Clock size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Waiting for Approval</h2>
          <p className="text-slate-500 mb-8 leading-relaxed text-sm font-semibold">
            Your account has been created successfully. Our team will review your details and approve your account shortly.
          </p>
          <div className="bg-slate-50 rounded-2xl p-4 mb-8 text-left border border-slate-100 italic">
            <p className="text-xs text-slate-400 uppercase font-black tracking-widest mb-1 text-center">Next Steps</p>
            <div className="flex items-start gap-3 mt-3">
              <CheckCircle2 size={16} className="text-[#059669] mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600 font-bold">Admin reviews your business name</p>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <CheckCircle2 size={16} className="text-[#059669] mt-0.5 shrink-0" />
              <p className="text-sm text-slate-600 font-bold">Access to dashboard is unlocked</p>
            </div>
          </div>
          <Link href="/auth/login" className="block w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white rounded-full font-black text-sm uppercase tracking-widest transition-all">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#d1ebd7] font-sans flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
      <div className="w-full max-w-[400px] z-10 flex flex-col items-center">
        
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
            Register
          </h1>
          <p className="text-[#5d7c66] text-xs font-bold uppercase tracking-widest italic">
            Create new account
          </p>
        </div>

        {error && (
          <div className="w-full mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-[24px] border border-red-100 text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full space-y-5">
          <div className="space-y-1">
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Full Name"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1">
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              placeholder="Business Name"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1">
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="username@mail.com"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          <div className="space-y-1">
            <input
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              placeholder="Password"
              className="w-full bg-[#96b39d]/90 text-white placeholder-[#4d6a54] outline-none rounded-full py-4.5 px-8 font-bold text-sm transition-all shadow-inner focus:bg-[#8ca893]"
            />
          </div>

          {/* Terms checkbox */}
          <div className="flex items-start px-2 text-[#2f593b] text-xs font-black leading-tight">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <div className="relative w-4.5 h-4.5 rounded-full border-2 border-[#2f593b] flex items-center justify-center transition-all bg-transparent mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
                {termsAccepted && <div className="w-2 h-2 rounded-full bg-[#2f593b]" />}
              </div>
              <span className="opacity-90">
                I agree to the{' '}
                <button type="button" onClick={() => setShowTerms(true)} className="underline font-black hover:opacity-85">
                  Terms
                </button>{' '}
                and{' '}
                <a href="https://uwo24.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline font-black hover:opacity-85">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>

          {/* Sign Up Button */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4.5 bg-[#45724c] hover:bg-[#3b6342] text-white font-black text-sm uppercase tracking-widest rounded-full transition-all duration-300 shadow-lg shadow-emerald-950/10 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              {loading ? <Loader2 className="animate-spin text-white" size={18} /> : 'Sign Up'}
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
        <div className="flex items-center gap-6">
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.78 0-8.67-3.89-8.67-8.67s3.89-8.67 8.67-8.67c2.14 0 4.09.78 5.61 2.07l3.22-3.22C18.3 1.34 15.42 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.9 0 11.5-4.86 11.5-11.7 0-.79-.07-1.56-.2-2.3H12.24z"/>
            </svg>
          </button>
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
          </button>
          <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-950/5 hover:scale-105 transition-all cursor-pointer">
            <svg className="w-6 h-6 text-slate-800" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
            </svg>
          </button>
        </div>

        {/* Toggle to login */}
        <div className="mt-10 text-center">
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

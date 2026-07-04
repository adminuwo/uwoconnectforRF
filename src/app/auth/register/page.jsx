'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Loader2, Clock, CheckCircle2, Sparkles, Check } from 'lucide-react';
import axios from 'axios';

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
      <div className="min-h-screen bg-white font-sans selection:bg-[#10B981]/20 selection:text-[#1F2937] flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background blobs/glows */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div
            className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#DCFCE7]/40 blur-[130px]"
          />
        </div>

        <div className="bg-white/70 backdrop-blur-[24px] border border-[#16A34A]/15 p-10 rounded-[32px] shadow-2xl max-w-md w-full text-center z-10">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#059669]">
            <Clock size={40} className="" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Waiting for Approval</h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
            Your account has been created successfully. Our team will review your details and approve your account shortly.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 mb-8 text-left border border-gray-100 italic">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-widest mb-1 text-center">Next Steps</p>
            <div className="flex items-start gap-3 mt-3">
              <CheckCircle2 size={16} className="text-[#059669] mt-0.5" />
              <p className="text-sm text-gray-600">Admin reviews your business name</p>
            </div>
            <div className="flex items-start gap-3 mt-3">
              <CheckCircle2 size={16} className="text-[#059669] mt-0.5" />
              <p className="text-sm text-gray-600">Access to dashboard is unlocked</p>
            </div>
          </div>
          <Link href="/auth/login" className="block w-full py-4 bg-gradient-to-r from-[#16A34A] to-[#059669] text-white rounded-2xl font-bold hover:opacity-95 transition-all shadow-md">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

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

        {/* Register Card */}
        <div className="w-full bg-white/60 backdrop-blur-[24px] border border-[#16A34A]/15 rounded-[32px] p-8 sm:p-10 shadow-[0_20px_50px_rgba(16,185,129,0.03)] shadow-emerald-950/[0.01] transition-all duration-300 relative overflow-hidden">
          {/* Top Shine */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#BBF7D0]/40 to-transparent" />

          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight">Create Account</h2>
            <p className="text-slate-500 text-sm font-medium mt-2 text-center">Sign up to start sending messages.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-600 text-xs font-bold rounded-2xl border border-red-100">{error}</div>
          )}

          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Full Name</label>
                <input
                  type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3 pl-4 pr-4 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Business Name</label>
                <input
                  type="text" required value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3 pl-4 pr-4 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email Address</label>
              <input
                type="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3.5 px-5 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
              <input
                type="password" required value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/75 border border-slate-200 rounded-2xl py-3.5 px-5 text-[#1F2937] placeholder-slate-400 outline-none focus:border-[#16A34A] focus:ring-4 focus:ring-[#16A34A]/10 transition-all duration-300 font-medium text-sm shadow-sm"
              />
            </div>

            <div className="bg-gray-50/50 p-4 rounded-2xl border border-slate-100 mt-2">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative w-4 h-4 rounded border border-slate-200 bg-white flex items-center justify-center group-hover:border-[#16A34A] transition-colors shrink-0">
                  <input
                    id="terms"
                    type="checkbox"
                    className="sr-only"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                  />
                  {termsAccepted && <Check size={12} className="text-[#16A34A]" strokeWidth={4} />}
                </div>
                <span className="text-xs text-gray-500 leading-tight">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[#16A34A] font-semibold hover:text-[#14532D] transition-colors">
                    Terms
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-[#16A34A] font-semibold hover:text-[#14532D] transition-colors">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#16A34A] to-[#059669] hover:opacity-95 text-white font-bold rounded-2xl shadow-lg shadow-emerald-100/50 transition-all flex items-center justify-center gap-2 mt-4"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : 'Sign Up'}
              {!loading && <ArrowRight size={20} className="text-white" />}
            </button>
          </form>

          <footer className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-[#16A34A] font-bold hover:underline hover:text-[#14532D] transition-colors">Log in</Link>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;




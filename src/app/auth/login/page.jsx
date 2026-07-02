'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, ArrowRight, Check, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      // Route based on role
      if (data.user.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/client');
      }
    } catch (error) {
      alert(error.message || 'An error occurred during login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] font-sans selection:bg-[#15803D]/20 selection:text-[#2B2B2B] overflow-hidden relative">
      {/* Background blobs/glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            x: [0, 30, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#15803D]/10 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, -30, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-[10%] right-[10%] w-[60%] h-[60%] rounded-full bg-[#DCFCE7]/30 blur-[100px]"
        />
      </div>

      {/* LEFT PANEL - Playful 3D Character (55%) */}
      <div className="hidden lg:flex flex-col w-[55%] relative overflow-hidden z-10 p-16 xl:p-24 justify-between">
        {/* Soft studio light overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#FAFAFA]/80 via-[#DCFCE7]/10 to-[#166534]/5 pointer-events-none" />

        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-3 relative z-10"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#14532D] via-[#166534] to-[#15803D] flex items-center justify-center shadow-sm border border-white/50">
            <Sparkles className="text-white" size={18} strokeWidth={2.5} />
          </div>
          <span className="text-[#2B2B2B] font-bold text-xl tracking-tight">EFV Unified.</span>
        </motion.div>

        {/* Character & Message Wrapper */}
        <div className="relative flex flex-col items-center my-auto w-full max-w-xl mx-auto z-10">
          {/* Pixar character illustration */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{
              opacity: 1,
              y: [0, -12, 0]
            }}
            transition={{
              opacity: { duration: 0.8 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" }
            }}
            className="w-full max-w-[340px] aspect-[2/3] relative mb-10 drop-shadow-[0_20px_40px_rgba(20,83,45,0.06)]"
          >
            <img
              src="/character.png"
              alt="EFV Character"
              className="w-full h-full object-contain rounded-3xl"
            />
            {/* Floating abstract decorative elements */}
            <motion.div
              animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-4 -right-4 w-12 h-12 rounded-2xl bg-white/60 backdrop-blur-md shadow-md border border-white flex items-center justify-center"
            >
              <Sparkles className="text-[#14532D]" size={20} />
            </motion.div>
            <motion.div
              animate={{ y: [0, 8, 0], rotate: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-10 -left-6 w-10 h-10 rounded-full bg-[#15803D]/85 backdrop-blur-md shadow-md flex items-center justify-center text-lg"
            >
              👋
            </motion.div>
          </motion.div>

          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl xl:text-5xl font-black text-[#2B2B2B] tracking-tight mb-4"
            >
              Welcome Back!
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-slate-600 font-medium text-sm xl:text-base leading-relaxed"
            >
              Your AI-powered workspace for CRM, Marketing, Social Media, Projects and Business Automation.
            </motion.p>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xs font-semibold text-slate-400 uppercase tracking-wider text-center relative z-10"
        >
          © 2026 EFV Unified Platform
        </motion.div>
      </div>

      {/* RIGHT PANEL - Authentication (45%) */}
      <div className="w-full lg:w-[45%] relative flex items-center justify-center p-6 sm:p-12 z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-[440px]"
        >
          {/* Glass Card */}
          <div className="bg-white/75 backdrop-blur-[25px] border border-white/50 rounded-[28px] p-8 sm:p-10 shadow-[0_20px_40px_rgba(43,43,43,0.04)] hover:shadow-[0_20px_40px_rgba(20,83,45,0.05)] transition-all duration-300 relative overflow-hidden">
            {/* Top Shine */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />

            <div className="flex flex-col items-center mb-8">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14532D] via-[#166534] to-[#15803D] flex items-center justify-center shadow-sm border border-white/50 mb-4">
                <Sparkles className="text-white" size={22} />
              </div>
              <h2 className="text-2xl font-bold text-[#2B2B2B] tracking-tight">Sign In</h2>
              <p className="text-slate-500 text-xs font-medium mt-1">Access your platform dashboard.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-slate-400 group-focus-within:text-[#14532D] transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-white border border-slate-200/80 rounded-full py-3.5 pl-11 pr-6 text-[#2B2B2B] placeholder-slate-400 outline-none focus:border-[#14532D] focus:ring-4 focus:ring-[#14532D]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-slate-400 group-focus-within:text-[#14532D] transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-200/80 rounded-full py-3.5 pl-11 pr-6 text-[#2B2B2B] placeholder-slate-400 outline-none focus:border-[#14532D] focus:ring-4 focus:ring-[#14532D]/10 transition-all duration-300 font-medium text-sm shadow-sm"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative w-4 h-4 rounded border border-slate-200 bg-white flex items-center justify-center group-hover:border-[#14532D] transition-colors">
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    {rememberMe && <Check size={12} className="text-[#14532D]" strokeWidth={4} />}
                  </div>
                  <span className="text-xs font-semibold text-slate-500 group-hover:text-slate-600 transition-colors">Remember me</span>
                </label>
                <Link href="#" className="text-xs font-semibold text-[#14532D] hover:text-[#166534] transition-colors">
                  Forgot Password?
                </Link>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full rounded-full py-3.5 px-6 text-white font-bold text-[12px] uppercase tracking-wider overflow-hidden group shadow-[0_8px_20px_rgba(20,83,45,0.2)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#14532D] via-[#166534] to-[#15803D] group-hover:opacity-90 transition-opacity" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {loading ? <Loader2 className="animate-spin" size={18} /> : (
                      <>Continue <ArrowRight size={16} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" /></>
                    )}
                  </span>
                </button>
              </div>
            </form>

            <div className="mt-6 mb-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Or continue with</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { name: 'Google', icon: 'M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z', color: '#4285F4' },
                { name: 'Microsoft', icon: 'M11.4 24h-11.4v-11.4h11.4v11.4zm12.6 0h-11.4v-11.4h11.4v11.4zm-12.6-12.6h-11.4v-11.4h11.4v11.4zm12.6 0h-11.4v-11.4h11.4v11.4z', color: '#00A4EF' },
                { name: 'Meta', icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z', color: '#1877F2' }
              ].map((provider) => (
                <button
                  key={provider.name}
                  className="flex items-center justify-center p-3 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50 transition-all hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(0,0,0,0.02)]"
                  title={`Login with ${provider.name}`}
                >
                  <svg className="w-5 h-5 fill-current text-slate-600" viewBox="0 0 24 24">
                    <path d={provider.icon} />
                  </svg>
                </button>
              ))}
            </div>

            <div className="mt-6 text-center">
              <p className="text-xs font-semibold text-slate-500">
                Don't have an account? <Link href="/auth/register" className="text-[#14532D] hover:text-[#166534] transition-colors">Sign up</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;

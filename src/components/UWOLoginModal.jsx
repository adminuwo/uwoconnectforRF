'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, ShieldCheck, ArrowRight, Lock, Mail, User, AlertCircle } from 'lucide-react';
import { API_URL, getUnifiedApiBaseUrl } from '@/config/apiConfig';

export const UWOLoginModal = ({
  isOpen,
  onClose,
  onSuccess,
  appCode = 'uwoconnect',
  apiKey = 'key_uwoconnect_live_master_2026',
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('abha@uwo24.com');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const unifiedApiBase = getUnifiedApiBaseUrl();

      // 1. Try local UWOConnect Backend authentication first
      try {
        const localRes = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const localData = await localRes.json();
        if (localRes.ok && (localData.token || localData.access_token)) {
          const authToken = localData.token || localData.access_token;
          localStorage.setItem('token', authToken);
          localStorage.setItem('uwo_token', authToken);
          if (localData.user) {
            localStorage.setItem('user', JSON.stringify(localData.user));
          }

          setSuccessMsg('Signed in successfully!');
          setTimeout(() => {
            if (onSuccess) onSuccess(localData);
            onClose();
            const role = localData.user?.role;
            window.location.href = role === 'ADMIN' ? '/admin' : '/client';
          }, 400);
          return;
        } else if (localRes.status === 400 || localRes.status === 401) {
          setError(localData.message || localData.detail || 'Invalid email or password. Please check your credentials.');
          setLoading(false);
          return;
        }
      } catch (localErr) {
        console.warn('[UWO Login] Local backend auth skipped, trying unified SSO base...', localErr);
      }

      // 2. Fallback to Central UWO SSO if local auth is unreached
      if (isRegisterMode) {
        const regRes = await fetch(`${unifiedApiBase}/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Application-Key': apiKey,
          },
          body: JSON.stringify({ name, email, password }),
        });

        const regData = await regRes.json();
        if (!regRes.ok) {
          let errorText = 'Registration failed';
          if (typeof regData.detail === 'string') {
            errorText = regData.detail;
          } else if (Array.isArray(regData.detail)) {
            errorText = regData.detail.map((d) => d.msg || d.detail || JSON.stringify(d)).join(', ');
          } else if (regData.detail) {
            errorText = typeof regData.detail === 'object' ? JSON.stringify(regData.detail) : String(regData.detail);
          } else if (regData.message) {
            errorText = String(regData.message);
          }

          if (errorText.toLowerCase().includes('already exists')) {
            errorText = 'An account with this email already exists. Switching to Sign In...';
            setTimeout(() => {
              setIsRegisterMode(false);
              setError('');
            }, 1800);
          }
          setError(errorText);
          setLoading(false);
          return;
        }

        setSuccessMsg('Account created successfully! Signing in...');
      }

      const loginRes = await fetch(`${unifiedApiBase}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Application-Key': apiKey,
        },
        body: JSON.stringify({ email, password }),
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        let loginErr = 'Invalid email or password';
        if (typeof loginData.detail === 'string') {
          loginErr = loginData.detail;
        } else if (Array.isArray(loginData.detail)) {
          loginErr = loginData.detail.map((d) => d.msg || d.detail).join(', ');
        } else if (loginData.detail) {
          loginErr = typeof loginData.detail === 'object' ? JSON.stringify(loginData.detail) : String(loginData.detail);
        }
        setError(loginErr);
        setLoading(false);
        return;
      }

      // Fetch user profile from /auth/me
      let uwoUser = { email, name: name || email.split('@')[0] };
      try {
        const meRes = await fetch(`${unifiedApiBase}/auth/me`, {
          headers: { Authorization: `Bearer ${loginData.access_token}` },
        });
        if (meRes.ok) {
          uwoUser = await meRes.json();
        }
      } catch (meErr) {
        console.warn('Failed to fetch /auth/me:', meErr);
      }

      let finalData = { ...loginData, user: uwoUser };
      if (loginData.access_token) {
        localStorage.setItem('uwo_access_token', loginData.access_token);
      }
      if (finalData.token || finalData.access_token) {
        const t = finalData.token || finalData.access_token;
        localStorage.setItem('token', t);
        localStorage.setItem('uwo_token', t);
      }
      if (finalData.user) {
        localStorage.setItem('user', JSON.stringify(finalData.user));
      }

      setSuccessMsg('Signed in successfully!');
      setTimeout(() => {
        if (onSuccess) onSuccess(finalData);
        onClose();
        window.location.href = finalData.user?.role === 'ADMIN' ? '/admin' : '/client';
      }, 500);
    } catch (err) {
      console.error('[UWO Login Error]', err);
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ type: 'spring', duration: 0.4 }}
          className="relative w-full max-w-md bg-[#16271c] border border-emerald-500/25 rounded-3xl p-7 shadow-2xl shadow-emerald-950/40 text-white overflow-hidden"
        >
          {/* Ambient Glow */}
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-[#45724c]/20 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex items-start justify-between relative z-10 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#111e16] rounded-[14px] flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  {isRegisterMode ? 'Create UWO Connect Account' : 'Sign In to UWO Connect'}
                </h3>
                <p className="text-xs text-emerald-300/70">Unified Communication & Business Automation</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-red-500/20 border border-red-500/40 text-red-200 text-xs font-semibold flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs font-semibold flex items-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {isRegisterMode && (
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/60 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span>{isRegisterMode ? 'Create UWO Connect Account' : 'Sign In to Workspace'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer toggle */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400 relative z-10">
            <span>{isRegisterMode ? 'Already have an account?' : "Don't have an account?"}</span>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError('');
                setSuccessMsg('');
              }}
              className="text-emerald-400 font-semibold hover:text-emerald-300 transition-colors cursor-pointer"
            >
              {isRegisterMode ? 'Sign In Instead' : 'Create Account'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UWOLoginModal;

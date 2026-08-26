'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Clock, Eye, EyeOff, ShieldCheck, User, Building2, Mail, Lock, AlertCircle, ArrowRight, CheckCircle2, Phone, Briefcase, Layers } from 'lucide-react';
import axios from 'axios';
import TermsModal from '@/components/TermsModal';
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

const RegisterPage = () => {
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get('invite_token');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    department: 'Sales',
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
  const [showUWOModal, setShowUWOModal] = useState(false);
  const [inviteInfo, setInviteInfo] = useState(null);
  const router = useRouter();

  const API_URL = API_BASE_URL;

  useEffect(() => {
    if (inviteToken) {
      axios.get(`${API_URL}/api/team/invites/validate/?token=${inviteToken}`)
        .then(res => {
          if (res.data.valid) {
            setInviteInfo(res.data);
          }
        })
        .catch(err => {
          console.error('Invalid or expired invite token:', err);
        });
    }
  }, [inviteToken, API_URL]);

  const handleBackendAuth = async (firebaseUser, extraData = {}) => {
    const idToken = await firebaseUser.getIdToken();
    const res = await axios.post(`${API_URL}/api/auth/firebase-login`, {
      id_token: idToken,
      name: extraData.name || firebaseUser.displayName || '',
      business_name: extraData.businessName || '',
      phone_number: extraData.phone || '',
      designation: extraData.designation || 'Team Member',
      department: extraData.department || 'General',
      invite_token: inviteToken || '',
    });

    if (res.status === 201) {
      setSuccess(true);
      setLoading(false);
      return;
    }

    const { token, user } = res.data;
    storeUserSession(token, user);

    if (user.role !== 'ADMIN' && !localStorage.getItem('aisa_tour_completed')) {
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
    if (!termsAccepted) {
      setError('You must agree to the Terms and Privacy Policy before continuing.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      console.error('Google registration error:', err);
      setError(parseAuthError(err, 'Google'));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!termsAccepted) {
      setError('You must agree to the Terms and Privacy Policy before continuing.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      console.error('Facebook registration error:', err);
      setError(parseAuthError(err, 'Facebook'));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    if (!termsAccepted) {
      setError('You must agree to the Terms and Privacy Policy before continuing.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      console.error('Github registration error:', err);
      setError(parseAuthError(err, 'GitHub'));
    } finally {
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
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone.trim(),
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        password: formData.password,
        invite_token: inviteToken || '',
      });

      if (res.status === 201 && res.data.token) {
        const { token, user } = res.data;
        storeUserSession(token, user);

        if (user.role !== 'ADMIN' && !localStorage.getItem('aisa_tour_completed')) {
          localStorage.setItem('aisa_tour_pending', 'true');
          localStorage.removeItem('aisa_tour_step');
        }

        if (user.role === 'ADMIN') {
          router.push('/admin');
        } else {
          router.push('/client');
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data) {
        if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          const firstErrorKey = Object.keys(err.response.data)[0];
          const firstErrorVal = err.response.data[firstErrorKey];
          setError(Array.isArray(firstErrorVal) ? firstErrorVal[0] : firstErrorVal);
        }
      } else {
        setError(err.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#edf7f0] font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Dynamic ambient background glow circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[140px] pointer-events-none" />

        <div className="bg-white/95 backdrop-blur-2xl border border-white/80 p-8 sm:p-10 rounded-[32px] shadow-[0_25px_60px_-15px_rgba(5,150,105,0.2)] max-w-md w-full text-center z-10 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 bg-emerald-100/80 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Clock size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Registration Submitted</h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm font-medium">
            Your account is currently pending review by our administrator. You will receive an email once your workspace access has been approved.
          </p>
          <Link 
            href="/auth/login" 
            className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <span>Return to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#edf7f0] font-sans flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden py-10">
      {/* Dynamic ambient background glow circles */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[30%] right-[15%] w-[350px] h-[350px] bg-emerald-200/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Decorative Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#059669 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="w-full max-w-[480px] z-10 bg-white/90 backdrop-blur-2xl border border-white/80 rounded-[32px] p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(5,150,105,0.15),0_0_20px_rgba(255,255,255,0.8)_inset] flex flex-col items-center transition-all">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-4 px-4 py-1.5 rounded-full bg-emerald-50/80 border border-emerald-200/60 shadow-sm">
          <img 
            src="/download (3).gif" 
            alt="UwoConnect Logo" 
            className="w-5 h-5 rounded-full object-contain"
          />
          <span className="text-emerald-900 font-bold text-xs tracking-wider uppercase">
            UwoConnect
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Title Section */}
        <div className="text-center mb-4 w-full">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1">
            {inviteToken ? 'Join Team' : 'Create Account'}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm font-medium">
            {inviteToken ? 'Complete your member profile to join the workspace' : 'Start automating your channels today'}
          </p>
        </div>

        {/* Workspace Invite Banner */}
        {inviteToken && (
          <div className="w-full mb-4 p-3.5 bg-emerald-50/90 text-emerald-800 text-xs font-bold rounded-2xl border border-emerald-200 flex items-center gap-3 shadow-xs animate-in fade-in duration-300">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Building2 size={18} />
            </div>
            <div className="text-left">
              <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-black">Official Team Invitation</p>
              <p className="text-xs font-bold text-slate-900">
                Joining Workspace: <span className="text-emerald-700 font-extrabold">{inviteInfo?.business_name || 'uwo'}</span>
              </p>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="w-full mb-4 p-3 bg-red-50 text-red-700 text-xs font-semibold rounded-2xl border border-red-200/80 flex items-start gap-2.5 animate-in fade-in duration-200 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="w-full space-y-3">
          {/* 1. Full Name */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 ml-1">
              Full Name <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* 2. Business Name (Only if NOT joining via invite) */}
          {!inviteToken && (
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 ml-1">
                Business / Company Name <span className="text-emerald-600">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Acme Enterprises"
                  className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                />
              </div>
            </div>
          )}

          {/* 3. Email Address */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 ml-1">
              Email Address <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* 4. Phone Number */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 ml-1">
              Phone Number <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>
          </div>

          {/* 5. Designation & Department (Side by Side on medium screens) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 ml-1">
                Designation / Role {inviteToken && <span className="text-emerald-600">*</span>}
              </label>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required={Boolean(inviteToken)}
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  placeholder="e.g. Sales Executive"
                  className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-3 font-medium text-xs border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700 ml-1">
                Department
              </label>
              <div className="relative">
                <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full bg-slate-50/90 text-slate-900 outline-none rounded-2xl py-2.5 pl-10 pr-3 font-medium text-xs border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm cursor-pointer"
                >
                  <option value="Sales">Sales</option>
                  <option value="Support">Support & Success</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                  <option value="Engineering">Engineering / IT</option>
                  <option value="Management">Management</option>
                  <option value="General">General</option>
                </select>
              </div>
            </div>
          </div>

          {/* 6. Password */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700 ml-1">
              Password <span className="text-emerald-600">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-11 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
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

          {/* Terms checkbox */}
          <div className="flex items-center gap-2 px-1 pt-1 text-left">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 border-slate-300 focus:ring-emerald-500 cursor-pointer accent-emerald-600 shrink-0"
            />
            <label htmlFor="terms" className="text-[11px] sm:text-xs text-slate-600 cursor-pointer select-none leading-normal">
              I agree to the{' '}
              <span 
                role="button"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowTerms(true);
                }} 
                className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Terms of Service
              </span>{' '}
              and{' '}
              <Link 
                href="/privacy" 
                onClick={(e) => e.stopPropagation()}
                className="font-bold text-emerald-700 hover:text-emerald-800 underline cursor-pointer"
              >
                Privacy Policy
              </Link>
            </label>
          </div>

          {/* Register / Join Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 via-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="animate-spin text-white w-5 h-5" />
              ) : (
                <>
                  <span>{inviteToken ? 'Complete & Join Workspace' : 'Create Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-3 my-4">
          <div className="h-[1px] bg-slate-200 flex-1" />
          <span className="text-slate-400 text-[11px] font-bold uppercase tracking-wider">
            Or continue with
          </span>
          <div className="h-[1px] bg-slate-200 flex-1" />
        </div>

        {/* UWO SSO & Social */}
        <div className="w-full space-y-2.5">
          <button
            type="button"
            onClick={() => setShowUWOModal(true)}
            title="Sign up with Unified Web Options (UWO SSO)"
            className="w-full py-3 px-4 bg-gradient-to-r from-[#112317] via-[#1a3824] to-[#112317] hover:from-[#0d1c12] hover:to-[#152e1d] text-white rounded-2xl flex items-center justify-center gap-2 shadow-md border border-emerald-500/30 hover:border-emerald-400/60 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer font-bold text-xs tracking-wider uppercase"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Sign Up with UWO SSO</span>
          </button>

          <div className="grid grid-cols-3 gap-2.5">
            <button 
              type="button"
              onClick={handleGoogleLogin} 
              title="Continue with Google" 
              className="h-10 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-2xl flex items-center justify-center shadow-sm hover:shadow hover:border-slate-300 transition-all cursor-pointer group active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
            </button>
            <button 
              type="button"
              onClick={handleGithubLogin} 
              title="Continue with GitHub" 
              className="h-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow transition-all cursor-pointer group active:scale-95"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
            </button>
            <button 
              type="button"
              onClick={handleFacebookLogin} 
              title="Continue with Facebook" 
              className="h-10 bg-[#1877F2] hover:bg-[#166fe5] text-white rounded-2xl flex items-center justify-center shadow-sm hover:shadow transition-all cursor-pointer group active:scale-95"
            >
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Toggle to login */}
        <div className="mt-5 text-center">
          <p className="text-xs font-semibold text-slate-500">
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              className="text-emerald-700 hover:text-emerald-800 font-bold hover:underline transition-all"
            >
              Log In
            </Link>
          </p>
        </div>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
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

export default RegisterPage;

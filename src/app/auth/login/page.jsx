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
  QrCode,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';
import axios from 'axios';
import UWOLoginModal from '@/components/UWOLoginModal';
import TermsModal from '@/components/TermsModal';
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  signInWithPopup,
} from '@/lib/firebase';
import { storeUserSession } from '@/features/auth/authHelpers';
import { API_BASE_URL } from '@/config/apiConfig';
import { useBrand } from '@/context/BrandContext';
import { useTheme } from '@/context/ThemeContext';

const LoginPage = () => {
  const { brand } = useBrand();
  const { isDark, toggleTheme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loadingProvider, setLoadingProvider] = useState(null); // 'email' | 'google' | 'github' | 'facebook' | null
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showUWOModal, setShowUWOModal] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
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
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
      setError(parseAuthError(err, 'Google'));
    } finally {
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
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') return;
      setError(parseAuthError(err, 'Facebook'));
    } finally {
      setLoadingProvider(null);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoadingProvider('email');
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, { email, password });
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
      if (err.response?.data?.is_email_unverified) {
        router.push(`/auth/verify-email?email=${encodeURIComponent(email)}&reason=unverified`);
        return;
      }
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
    <div className="min-h-screen w-full flex items-center justify-center pt-20 sm:pt-4 p-4 bg-[#f8fafc] dark:bg-[#070B14] font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white transition-colors duration-300">
      
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/10 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] opacity-50 dark:opacity-20" />

      {/* Brand Header */}
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8 right-4 sm:right-8 z-50 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
          {brand?.logo_url && brand.logo_url !== "/download (3).gif" ? (
            <img src={brand.logo_url} alt="Logo" className="w-8 h-8 sm:w-11 sm:h-11 object-contain rounded-full shadow-lg" />
          ) : (
            <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-slate-800 shadow-[0_4px_20px_rgba(16,185,129,0.25)] border-[1.5px] border-emerald-100 dark:border-emerald-800/40">
              <img src="/logo.png" alt="UWO Connect Logo" className="w-full h-full object-contain p-1.5" />
            </div>
          )}
          <span className="font-extrabold text-slate-900 dark:text-white tracking-tight text-base sm:text-xl drop-shadow-sm group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {brand?.brand_name || "UWO Connect"}
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2.5 rounded-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 shadow-sm transition-all cursor-pointer"
          aria-label="Toggle Theme"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>

      {/* Main Login Card - Split Layout */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-[1000px] bg-white dark:bg-[#0F172A] rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.06)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row overflow-hidden relative z-10 min-h-[600px] transition-colors"
      >
        
        {/* Left Side: Hero Illustration & Marketing (Hidden on small screens) */}
        <div className="hidden md:flex flex-col justify-between items-center w-2/5 p-10 bg-slate-50 dark:bg-slate-900/60 border-r border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors">
          
          {/* Subtle Decorative Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.06)_0%,rgba(248,250,252,0)_60%)] dark:bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.12)_0%,transparent_60%)] pointer-events-none" />
          
          {/* Extremely thin curved connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-30" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            <path d="M-100,200 C100,100 300,300 500,100" fill="none" stroke="url(#grad1)" strokeWidth="0.5" />
            <path d="M-50,450 C150,550 250,350 450,450" fill="none" stroke="url(#grad2)" strokeWidth="0.5" />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0" />
                <stop offset="50%" stopColor="#10b981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="grad2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* Tiny subtle dots */}
          <div className="absolute top-[25%] left-[20%] w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-40 blur-[0.5px]" />
          <div className="absolute bottom-[30%] right-[25%] w-2 h-2 bg-blue-400 rounded-full opacity-30 blur-[0.5px]" />
          <div className="absolute top-[60%] left-[15%] w-1 h-1 bg-emerald-500 rounded-full opacity-50 blur-[0.5px]" />

          {/* Abstract circular shapes */}
          <div className="absolute -top-20 -left-20 w-64 h-64 border border-emerald-100 dark:border-emerald-900/40 rounded-full opacity-50 pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 border border-blue-50 dark:border-blue-900/40 rounded-full opacity-50 pointer-events-none" />

          {/* Hero Illustration - Abha + Dev */}
          <div className="relative z-10 w-full flex-1 flex items-center justify-center mt-12 mb-8">
            <img 
              src="/abha_dev_login.png" 
              alt="Abha and Dev - UWO Connect" 
              className="max-w-full max-h-[100%] object-contain filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.03)]"
            />
          </div>

          {/* Restored Marketing Text */}
          <div className="relative z-10 w-full mt-auto">
            <h2 className="text-3xl font-serif font-bold text-emerald-900 dark:text-emerald-300 mb-4 leading-tight">
              Build your <br/> automation empire.
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Connect all your tools in one seamless dashboard and let your workflows run on autopilot.
            </p>
            
            <div className="mt-8 flex items-center gap-2 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              Secure • Fast • Reliable
            </div>
          </div>
        </div>

        {/* Right Side: The Form */}
        <div className="w-full md:w-3/5 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-[#0F172A] relative transition-colors">
          
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-emerald-950 dark:text-emerald-300 tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Sign in to your workspace to continue.</p>
          </div>

          {/* QR Login Button */}
          <Link
            href="/auth/qr"
            className="w-full mb-8 p-4 bg-slate-50 dark:bg-slate-900/80 hover:bg-slate-100 dark:hover:bg-slate-800/80 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center gap-4 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold group-hover:scale-105 transition-transform">
              <QrCode size={20} />
            </div>
            <div className="flex-1 text-left">
              <h4 className="text-sm font-extrabold text-emerald-950 dark:text-emerald-300">
                Quick Mobile Login
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold mt-0.5">Scan QR for instant access</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
              <ChevronRight size={16} className="text-slate-400 dark:text-slate-300 group-hover:text-emerald-900 dark:group-hover:text-emerald-400 transition-colors" />
            </div>
          </Link>

          {/* Error Alert */}
          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="w-full mb-6 overflow-hidden">
                <div className="p-4 bg-red-50 text-red-700 text-xs font-bold rounded-xl border border-red-100 flex items-start gap-3">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                  <div className="flex-1 leading-relaxed">{error}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={handleEmailLogin} className="w-full space-y-5">
            <div className="space-y-1.5 w-full">
              <label htmlFor="login-email" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                Email Address
              </label>
              <div className="relative w-full">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-email" name="email" type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full block bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none rounded-xl py-3.5 pl-12 pr-4 font-bold text-sm border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5 w-full">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 ml-1">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative w-full">
                <Lock className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="login-password" name="password" type={showPassword ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full block bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none rounded-xl py-3.5 pl-12 pr-12 font-bold text-sm border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all"
                />
                <button
                  type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer select-none font-bold text-slate-600 dark:text-slate-400 text-xs px-1">
              <input
                type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 border-slate-300 dark:border-slate-600 dark:bg-slate-800 focus:ring-emerald-500 cursor-pointer accent-emerald-600"
              />
              <span>Remember me</span>
            </label>

            <button
              type="submit" disabled={isAnyLoading}
              className="w-full py-4 mt-2 text-white font-extrabold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer"
              style={{ backgroundColor: brand?.primary_color || '#059669' }}
            >
              {loadingProvider === 'email' ? <Loader2 className="animate-spin w-5 h-5" /> : (
                <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="w-full flex items-center gap-3 my-8">
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
            <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-widest">Or connect with</span>
            <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1" />
          </div>

          {/* SSO Buttons */}
          <div className="w-full grid grid-cols-3 gap-3">
            <button
              type="button" disabled={isAnyLoading} onClick={handleGoogleLogin}
              className="h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl flex items-center justify-center transition-colors group cursor-pointer"
            >
              {loadingProvider === 'google' ? <Loader2 className="w-5 h-5 animate-spin text-slate-700 dark:text-slate-300" /> : (
                <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" /></svg>
              )}
            </button>
            <button
              type="button" disabled={isAnyLoading} onClick={() => setShowUWOModal(true)}
              className="h-12 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/60 rounded-xl flex items-center justify-center transition-colors group cursor-pointer"
            >
              <img src="/uwo_sso_globe.jpg" alt="UWO SSO" className="w-5 h-5 rounded-full object-cover group-hover:scale-110 transition-transform" />
            </button>
            <button
              type="button" disabled={isAnyLoading} onClick={handleFacebookLogin}
              className="h-12 bg-[#1877F2] hover:bg-[#166fe5] border border-[#1877F2] rounded-xl flex items-center justify-center transition-colors group cursor-pointer"
            >
              {loadingProvider === 'facebook' ? <Loader2 className="w-5 h-5 animate-spin text-white" /> : (
                <svg className="w-5 h-5 text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              )}
            </button>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-emerald-700 dark:text-emerald-400 font-extrabold hover:underline transition-colors">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Footer / Terms */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center w-full px-4">
        <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
          By signing in, you agree to our{' '}
          <span onClick={() => setShowTerms(true)} className="text-slate-500 dark:text-slate-400 font-bold hover:underline cursor-pointer">Terms of Use (EULA)</span> and{' '}
          <Link href="/privacy" className="text-slate-500 dark:text-slate-400 font-bold hover:underline">Privacy Policy</Link>.
        </p>
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

export default LoginPage;

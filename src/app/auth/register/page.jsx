'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, Clock, Eye, EyeOff, ShieldCheck, User, Building2, Mail, Lock, AlertCircle, ArrowRight, ArrowLeft, CheckCircle2, Phone, Briefcase, Layers, XCircle, MapPin, Navigation } from 'lucide-react';
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
import { useBrand } from '@/context/BrandContext';
import { motion } from 'framer-motion';
import AuthHeroSide from '@/components/auth/AuthHeroSide';

const RegisterPage = () => {
  const { brand } = useBrand();
  const searchParams = useSearchParams();
  const inviteToken = searchParams?.get('invite_token');

  // Meta Portfolio Gate: null = unanswered, 'yes' = has portfolio, 'no' = no portfolio
  const [portfolioGate, setPortfolioGate] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    designation: '',
    department: 'Sales',
    businessName: '',
    portfolioName: '',
    password: '',
    invite_token: inviteToken || ''
  });
  const [detectingLocation, setDetectingLocation] = useState(false);
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

    // Attempt silent background location pre-fill if empty
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(data => {
        if (data && (data.city || data.country_name)) {
          const locParts = [data.city, data.region, data.country_name].filter(Boolean);
          setFormData(prev => prev.location ? prev : { ...prev, location: locParts.join(', ') });
        }
      })
      .catch(() => {
        // Silently fail if blocked or offline
      });
  }, [inviteToken, API_URL]);

  const handleDetectLocation = async () => {
    setDetectingLocation(true);
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || data.address?.state_district || '';
            const state = data.address?.state || '';
            const country = data.address?.country || '';
            const parts = [city, state, country].filter(Boolean);
            if (parts.length > 0) {
              setFormData(prev => ({ ...prev, location: parts.join(', ') }));
              setDetectingLocation(false);
              return;
            }
          } catch (e) {
            // fallback to ip
          }
          fallbackIpDetect();
        },
        () => {
          fallbackIpDetect();
        },
        { timeout: 6000 }
      );
    } else {
      fallbackIpDetect();
    }
  };

  const fallbackIpDetect = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      const data = await res.json();
      if (data && (data.city || data.country_name)) {
        const parts = [data.city, data.region, data.country_name].filter(Boolean);
        setFormData(prev => ({ ...prev, location: parts.join(', ') }));
      }
    } catch (e) {
      console.debug('Location auto-detect fallback failed:', e);
    } finally {
      setDetectingLocation(false);
    }
  };

  const handleBackendAuth = async (firebaseUser, extraData = {}) => {
    const idToken = await firebaseUser.getIdToken();
    const loc = extraData.location || formData.location || '';
    const locParts = loc.split(',').map(p => p.trim()).filter(Boolean);
    const res = await axios.post(`${API_URL}/api/auth/firebase-login`, {
      id_token: idToken,
      name: extraData.name || firebaseUser.displayName || '',
      business_name: extraData.businessName || '',
      meta_portfolio_name: extraData.portfolioName || '',
      phone_number: extraData.phone || '',
      location: loc,
      city: locParts[0] || '',
      country: locParts.length > 1 ? locParts[locParts.length - 1] : '',
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
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error('Google registration error:', err);
      setError(parseAuthError(err, 'Google'));
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error('Facebook registration error:', err);
      setError(parseAuthError(err, 'Facebook'));
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      await handleBackendAuth(result.user, formData);
    } catch (err) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.code === 'auth/cancelled-popup-request') {
        return;
      }
      console.error('Github registration error:', err);
      setError(parseAuthError(err, 'GitHub'));
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!termsAccepted) {
      setError('Please accept the Terms & Conditions and Privacy Policy to continue.');
      return;
    }
    if (!inviteToken && !formData.portfolioName.trim()) {
      setError('Please enter your Meta Portfolio name.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const loc = formData.location.trim();
      const locParts = loc.split(',').map(p => p.trim()).filter(Boolean);
      const res = await axios.post(`${API_URL}/api/auth/register`, {
        name: formData.name.trim(),
        businessName: formData.businessName.trim(),
        meta_portfolio_name: formData.portfolioName.trim(),
        portfolio_name: formData.portfolioName.trim(),
        email: formData.email.trim(),
        phone_number: formData.phone.trim(),
        location: loc,
        city: locParts[0] || '',
        country: locParts.length > 1 ? locParts[locParts.length - 1] : '',
        designation: formData.designation.trim(),
        department: formData.department.trim(),
        password: formData.password,
        termsAccepted: true,
        meta_portfolio_eligible: true,
        metaPortfolioEligible: true,
        invite_token: inviteToken || '',
        brand_domain: brand?.custom_domain || (typeof window !== 'undefined' ? window.location.hostname : ''),
        platform: 'web',
        device_type: 'desktop',
        registration_method: 'email'
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
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Registration Successful</h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-sm font-medium">
            Your {brand?.brand_name || 'UWO Connect'} account has been created and activated. You can now log in to access your business workspace.
          </p>
          <Link 
            href={brand?.custom_domain ? `/auth/login?brand_domain=${brand.custom_domain}` : '/auth/login'} 
            style={{ backgroundColor: brand?.primary_color || '#059669' }}
            className="w-full py-3.5 text-white rounded-2xl font-bold text-sm tracking-wide shadow-lg flex items-center justify-center gap-2 transition-all hover:brightness-110"
          >
            <span>Proceed to Login</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center p-4 bg-[#f8fafc] font-sans relative overflow-hidden selection:bg-emerald-500 selection:text-white py-6">
      {/* Subtle Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wMykiLz48L3N2Zz4=')] opacity-50" />

      {/* Top Brand Header */}
      <header className="relative z-20 w-full max-w-6xl mx-auto pt-2 pb-2 px-2 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          {brand?.logo_url && brand.logo_url !== "/download (3).gif" ? (
            <img src={brand.logo_url} alt="Logo" className="w-11 h-11 object-contain rounded-full shadow-lg" />
          ) : (
            <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center bg-white shadow-[0_4px_20px_rgba(16,185,129,0.25)] border-[1.5px] border-emerald-100 shrink-0">
              <img src="/uwo-icon.png" alt="UWO Connect Logo" className="w-full h-full object-contain p-1.5" />
            </div>
          )}
          <span className="font-extrabold text-slate-900 tracking-tight text-xl drop-shadow-sm group-hover:text-emerald-700 transition-colors">
            {brand?.brand_name || brand?.name || "UWO Connect"}
          </span>
        </Link>

        <Link
          href="/auth/login"
          className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl flex items-center gap-2 transition-all shadow-xs hover:shadow-sm"
        >
          <ArrowLeft size={14} />
          <span>Back to Sign In</span>
        </Link>
      </header>

      {/* Main Split Card */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center py-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[1050px] bg-white rounded-[32px] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col md:flex-row overflow-hidden relative z-10 my-auto"
        >
          {/* Left Side: Abha & Dev Hero */}
          <AuthHeroSide
            title={<>Build your <br/> automation empire.</>}
            subtitle="Connect all your tools in one seamless dashboard and let your workflows run on autopilot."
            badgeText="Secure • Fast • Reliable"
          />

          {/* Right Side: Registration Flow */}
          <div className="w-full md:w-3/5 p-6 sm:p-10 flex flex-col justify-center bg-white relative max-h-[85vh] overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 mb-4 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 shadow-xs">
          <img 
            src={brand?.logo_url || "/download (3).gif"} 
            alt={brand?.brand_name || "Brand Logo"} 
            width={20}
            height={20}
            style={{ width: '20px', height: '20px' }}
            className="w-5 h-5 rounded-full object-contain shrink-0"
          />
          <span className="text-slate-800 font-bold text-xs tracking-wider uppercase">
            {brand?.brand_name || "UWO Connect"}
          </span>
          <span 
            className="w-1.5 h-1.5 rounded-full animate-pulse" 
            style={{ backgroundColor: brand?.primary_color || '#059669' }}
          />
        </div>

        {/* ── STEP 1: Meta Portfolio Eligibility Gate ── */}
        {portfolioGate !== 'yes' ? (
          portfolioGate === 'enter_name' ? (
            /* Step 1 - Enter Meta Portfolio Name */
            <div className="w-full text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs border border-emerald-100">
                <Briefcase size={26} />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 font-serif">
                Enter Meta Portfolio Name
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                Please enter the exact name of your Meta Business Portfolio / Business Account to connect your channels.
              </p>

              <div className="space-y-3 mb-6 text-left">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 ml-1">
                    Meta Portfolio Name <span className="text-emerald-600">*</span>
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      autoFocus
                      id="input-meta-portfolio-name-gate"
                      value={formData.portfolioName}
                      onChange={(e) => setFormData({ ...formData, portfolioName: e.target.value })}
                      placeholder="e.g. Acme Meta Business Portfolio"
                      className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-3 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && formData.portfolioName.trim()) {
                          e.preventDefault();
                          setPortfolioGate('yes');
                        }
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 ml-1">
                    This can also be reviewed in the form below before submitting.
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <button
                  type="button"
                  id="btn-continue-portfolio-name"
                  disabled={!formData.portfolioName.trim()}
                  onClick={() => setPortfolioGate('yes')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Continue to Registration</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setPortfolioGate(null)}
                  className="w-full py-2.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition-colors cursor-pointer"
                >
                  ← Back to Selection
                </button>
              </div>
            </div>
          ) : portfolioGate === 'no' ? (
            /* Step 1 - NO State (Blocked) */
            <div className="w-full text-center py-2 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-14 h-14 bg-rose-100/90 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner border border-rose-200">
                <XCircle size={28} />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 font-serif">
                Meta Portfolio Required
              </h2>
              <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl mb-4 text-left">
                <p className="text-xs sm:text-sm font-bold text-rose-900 mb-1 flex items-center gap-1.5">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  Meta Portfolio is required to register for UWO Connect.
                </p>
                <p className="text-[12px] text-rose-800 leading-relaxed mt-1">
                  To connect WhatsApp Business, Instagram Direct, and Facebook Messenger automations, an active Meta Portfolio (Business Account) is required.
                </p>
              </div>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Once you have set up a Meta Portfolio for your business, you can return and continue your registration.
              </p>
              <div className="space-y-2.5">
                <button
                  type="button"
                  id="btn-reconsider-meta-yes"
                  onClick={() => setPortfolioGate('enter_name')}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>I Have a Meta Portfolio Now</span>
                  <ArrowRight size={14} />
                </button>
                <Link
                  href="/auth/login"
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-2xl font-bold text-xs transition-all flex items-center justify-center cursor-pointer block"
                >
                  Return to Login
                </Link>
              </div>
            </div>
          ) : (
            /* Step 1 - Initial Question */
            <div className="w-full text-center py-2 animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs border border-emerald-100">
                <Briefcase size={26} />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2 font-serif">
                Do you have a Meta Portfolio?
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mb-6 leading-relaxed">
                UWO Connect syncs official WhatsApp Business, Instagram Direct, and Facebook Messenger channels using your Meta Portfolio (Business Account).
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Option: YES */}
                <button
                  type="button"
                  id="btn-meta-portfolio-yes"
                  onClick={() => setPortfolioGate('enter_name')}
                  className="p-4 rounded-2xl border-2 border-emerald-500/80 bg-emerald-50/50 hover:bg-emerald-100/60 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                    <CheckCircle2 size={20} />
                  </div>
                  <div className="font-extrabold text-sm text-emerald-950">Yes</div>
                  <div className="text-[11px] text-emerald-700 font-medium">I have a Meta Portfolio</div>
                </button>

                {/* Option: NO */}
                <button
                  type="button"
                  id="btn-meta-portfolio-no"
                  onClick={() => setPortfolioGate('no')}
                  className="p-4 rounded-2xl border-2 border-slate-200 bg-white hover:bg-rose-50/40 hover:border-rose-300 transition-all flex flex-col items-center justify-center gap-2 group cursor-pointer shadow-xs hover:shadow-md"
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-rose-100 group-hover:text-rose-600 flex items-center justify-center shadow-2xs group-hover:scale-105 transition-all">
                    <XCircle size={20} />
                  </div>
                  <div className="font-extrabold text-sm text-slate-800 group-hover:text-rose-950">No</div>
                  <div className="text-[11px] text-slate-500 group-hover:text-rose-700 font-medium">I don't have one</div>
                </button>
              </div>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link 
                  href="/auth/login" 
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Already have an account? <span className="text-emerald-700 font-bold">Sign In</span>
                </Link>
              </div>
            </div>
          )
        ) : (
          <>
            {/* Meta Portfolio Confirmed Badge */}
            <div className="w-full mb-3 px-3.5 py-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span>Meta Portfolio: <strong>{formData.portfolioName ? `${formData.portfolioName} (Confirmed)` : 'Confirmed (Yes)'}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => setPortfolioGate('enter_name')}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 underline cursor-pointer"
              >
                Edit
              </button>
            </div>

            {/* Title Section */}
            <div className="text-center mb-4 w-full">
          <h1
            className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 font-serif"
            style={{ fontFamily: "'Times New Roman', Times, serif" }}
          >
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

          {/* 3. Meta Portfolio Name (Only if NOT joining via invite) */}
          {!inviteToken && (
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 ml-1">
                  Meta Portfolio Name <span className="text-emerald-600">*</span>
                </label>
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  Meta Verified
                </span>
              </div>
              <div className="relative">
                <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  id="input-meta-portfolio-name-form"
                  value={formData.portfolioName}
                  onChange={(e) => setFormData({ ...formData, portfolioName: e.target.value })}
                  placeholder="e.g. Acme Meta Business Portfolio"
                  className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
                />
              </div>
              <p className="text-[11px] text-slate-500 ml-1">
                The official name of your Meta Business Account / Portfolio
              </p>
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

          {/* 5. Location / City */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-700 ml-1">
                Location / City <span className="text-emerald-600">*</span>
              </label>
              <button
                type="button"
                onClick={handleDetectLocation}
                className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                title="Auto-detect location"
              >
                <Navigation className={`w-3 h-3 ${detectingLocation ? 'animate-spin' : ''}`} />
                <span>{detectingLocation ? 'Detecting...' : 'Auto-detect'}</span>
              </button>
            </div>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Mumbai, Maharashtra, India"
                className="w-full bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-4 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm"
              />
            </div>
            <p className="text-[11px] text-slate-400 ml-1">
              Used for client analytics and regional compliance
            </p>
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
          <div className="space-y-1 w-full" style={{ width: '100%' }}>
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 ml-1">
              Password <span className="text-emerald-600">*</span>
            </label>
            <div className="relative w-full" style={{ position: 'relative', width: '100%', display: 'block' }}>
              <Lock
                className="w-4 h-4 text-slate-400 pointer-events-none"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 10 }}
              />
              <input
                id="reg-password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="w-full block bg-slate-50/90 text-slate-900 placeholder:text-slate-400 outline-none rounded-2xl py-2.5 pl-10 pr-12 font-medium text-sm border border-slate-200/80 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all shadow-sm cursor-text select-text"
                style={{ width: '100%', display: 'block', boxSizing: 'border-box' }}
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowPassword((prev) => !prev);
                }}
                className="text-slate-400 hover:text-emerald-600 active:scale-95 transition-all p-1.5 rounded-xl focus:outline-none cursor-pointer flex items-center justify-center"
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', zIndex: 20, width: 'auto', height: 'auto', maxWidth: '36px', minWidth: 'unset' }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Eye className="w-4 h-4 text-slate-400 hover:text-emerald-600" />
                )}
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
                Terms &amp; Conditions
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
              style={{ backgroundColor: brand?.primary_color || '#059669' }}
              className="w-full py-3.5 text-white font-bold text-sm tracking-wide rounded-2xl transition-all duration-200 shadow-lg hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
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

        {/* Brand SSO & Social */}
        <div className="w-full">
          <div className="grid grid-cols-3 gap-2">
            <button 
              type="button"
              onClick={handleGoogleLogin} 
              title="Continue with Google" 
              className="h-10 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-400 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group active:scale-95 font-bold text-xs text-slate-700"
            >
              <svg className="w-4 h-4 shrink-0 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => setShowUWOModal(true)}
              title={`Sign up with ${brand?.brand_name || 'UWO'} SSO`}
              className="h-10 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-400 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group active:scale-95 font-bold text-xs text-slate-700"
            >
              <img
                src="/uwo_sso_globe.jpg"
                alt="UWO SSO Logo"
                className="w-5 h-5 rounded-full object-cover shrink-0 group-hover:scale-110 transition-transform shadow-xs"
              />
              <span>UWO SSO</span>
            </button>
            <button 
              type="button"
              onClick={handleFacebookLogin} 
              title="Continue with Facebook" 
              className="h-10 bg-white hover:bg-slate-50 border border-slate-200/90 hover:border-emerald-400 rounded-2xl flex items-center justify-center gap-1.5 shadow-xs hover:shadow-sm transition-all cursor-pointer group active:scale-95 font-bold text-xs text-slate-700"
            >
              <svg className="w-4 h-4 text-[#1877F2] shrink-0 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </button>
          </div>
        </div>

        {/* Toggle to login */}
        <div className="mt-5 text-center">
          <p className="text-xs font-semibold text-slate-500">
            Already have an account?{' '}
            <Link 
              href={brand?.custom_domain ? `/auth/login?brand_domain=${brand.custom_domain}` : '/auth/login'} 
              style={{ color: brand?.primary_color || '#059669' }}
              className="font-bold hover:underline transition-all"
            >
              Log In
            </Link>
            </p>
          </div>
        </>
      )}
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto py-3 px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 font-medium">
        <div>
          &copy; {new Date().getFullYear()} {brand?.brand_name || brand?.name || 'UWO Connect'} · All rights reserved.
        </div>
        <div className="flex items-center gap-5">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">Terms of Service</Link>
          <Link href="/contact" className="hover:text-slate-600 transition-colors">Support</Link>
        </div>
      </footer>

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

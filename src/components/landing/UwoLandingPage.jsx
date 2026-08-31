'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, MessageSquare, Share2, Layers, CheckCircle2, 
  LayoutDashboard, FileCheck, Receipt, FileText, ShoppingBag, 
  CreditCard, Users, Bot, Video, Sparkles, ArrowRight, ShieldCheck, 
  ChevronLeft, ChevronRight, ChevronDown, ChevronUp, RefreshCw, Check, Star, Lock, Globe, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AutomationNetwork from './AutomationNetwork';
import HeroWorkflowAnimation from './HeroWorkflowAnimation';
import UWOLoginModal from '@/components/UWOLoginModal';
import PricingComparisonTable from '@/components/pricing/PricingComparisonTable';

// ── AUTHENTIC SVG BRAND LOGOS ──
const WhatsAppLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#25D366" />
    <path fillRule="evenodd" clipRule="evenodd" d="M35.2 12.8C32.3 9.9 28.3 8.3 24.1 8.3C15.4 8.3 8.4 15.3 8.4 24C8.4 26.8 9.1 29.5 10.5 31.9L8.4 39.6L16.3 37.5C18.6 38.8 21.3 39.5 24.1 39.5C32.8 39.5 39.8 32.5 39.8 23.8C39.8 19.6 38.1 15.6 35.2 12.8ZM24.1 36.8C21.7 36.8 19.4 36.1 17.4 35L16.9 34.7L12.2 35.9L13.5 31.3L13.2 30.8C12 28.7 11.3 26.4 11.3 24C11.3 17 17 11.3 24.1 11.3C27.5 11.3 30.7 12.6 33.1 15C35.5 17.4 36.8 20.6 36.8 24C36.8 31 31.1 36.8 24.1 36.8ZM31 27.2C30.6 27 28.7 26.1 28.4 26C28 25.8 27.8 25.7 27.5 26.1C27.2 26.5 26.5 27.4 26.3 27.6C26.1 27.9 25.8 27.9 25.4 27.7C25 27.5 23.7 27.1 22.2 25.7C21 24.7 20.2 23.4 20 23C19.8 22.6 20 22.4 20.8 21.5C21 21.3 21.1 21.1 21.2 20.9C21.3 20.7 21.3 20.5 21.2 20.3C21.1 20.1 20.3 18.2 20 17.4C19.7 16.6 19.4 16.7 19.1 16.7H18.4C18.1 16.7 17.7 16.8 17.3 17.2C16.9 17.6 16 18.5 16 20.3C16 22.1 17.3 23.9 17.5 24.1C17.7 24.3 20.1 28 23.7 29.6C24.6 30 25.2 30.2 25.8 30.4C26.7 30.7 27.5 30.6 28.2 30.5C28.9 30.4 30.5 29.5 30.8 28.6C31.1 27.8 31.1 27.1 31 27.2Z" fill="white"/>
  </svg>
);

const InstagramLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <defs>
      <linearGradient id="igGradLanding" x1="0%" y1="100%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFD600" />
        <stop offset="25%" stopColor="#FF7A00" />
        <stop offset="50%" stopColor="#FF0069" />
        <stop offset="75%" stopColor="#D300C5" />
        <stop offset="100%" stopColor="#7638FA" />
      </linearGradient>
    </defs>
    <rect width="48" height="48" rx="12" fill="url(#igGradLanding)"/>
    <rect x="11" y="11" width="26" height="26" rx="7" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="24" cy="24" r="6" stroke="white" strokeWidth="3" fill="none"/>
    <circle cx="31.5" cy="16.5" r="1.75" fill="white"/>
  </svg>
);

const FacebookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <circle cx="24" cy="24" r="24" fill="#1877F2"/>
    <path d="M29.5 25.1L30.3 19.9H25.3V16.5C25.3 15.1 26 13.7 28.2 13.7H30.5V9.3C30.5 9.3 28.4 9 26.4 9C22.3 9 19.6 11.5 19.6 16V19.9H15V25.1H19.6V37.7C20.5 37.9 21.5 38 22.5 38C23.5 38 24.4 37.9 25.3 37.7V25.1H29.5Z" fill="white"/>
  </svg>
);

const YouTubeLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect width="48" height="48" rx="12" fill="#FF0000" />
    <path d="M33.2 24.1L19.5 16.2C19.2 16 18.8 16.2 18.8 16.6V32.4C18.8 32.8 19.2 33 19.5 32.8L33.2 24.9C33.5 24.7 33.5 24.3 33.2 24.1Z" fill="white"/>
  </svg>
);

const GmailLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <path d="M10 38V18.8L3 13.5V35C3 36.6 4.3 38 6 38H10Z" fill="#4285F4"/>
    <path d="M38 38V18.8L45 13.5V35C45 36.6 43.7 38 42 38H38Z" fill="#34A853"/>
    <path d="M38 18.8V10L24 20.5L10 10V18.8L24 29.3L38 18.8Z" fill="#EA4335"/>
    <path d="M10 10L3 13.5L10 18.8V10Z" fill="#C5221F"/>
    <path d="M38 10L45 13.5L38 18.8V10Z" fill="#FBBC04"/>
  </svg>
);

const OutlookLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="4" y="8" width="24" height="32" rx="3" fill="#0078D4" />
    <rect x="6" y="10" width="20" height="28" rx="2" fill="#28A8E8" />
    <path d="M16 16 C12 16 9 19 9 23 C9 27 12 30 16 30 C20 30 23 27 23 23 C23 19 20 16 16 16Z" fill="white" />
    <path d="M28 14 L44 20 L44 28 L28 34 Z" fill="#0078D4" />
  </svg>
);

const GoogleSheetsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#0F9D58" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#87CEAC"/>
    <rect x="15" y="19" width="18" height="16" rx="1" fill="white"/>
    <line x1="15" y1="24.5" x2="33" y2="24.5" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="15" y1="30" x2="33" y2="30" stroke="#0F9D58" strokeWidth="1.5"/>
    <line x1="24" y1="19" x2="24" y2="35" stroke="#0F9D58" strokeWidth="1.5"/>
  </svg>
);

const GoogleDocsLogo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className="shrink-0">
    <rect x="8" y="4" width="32" height="40" rx="4" fill="#4285F4" />
    <path d="M30 4L40 14H32C30.9 14 30 13.1 30 12V4Z" fill="#A1C2FA"/>
    <rect x="15" y="20" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="26" width="18" height="2.5" rx="1.25" fill="white" />
    <rect x="15" y="32" width="11" height="2.5" rx="1.25" fill="white" />
  </svg>
);

// ── SCROLL REVEAL ANIMATION WRAPPER ──
const ScrollReveal = ({ children, className = '', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.08 }
    );

    const node = domRef.current;
    if (node) {
      observer.observe(node);
    }

    return () => {
      if (node) observer.unobserve(node);
    };
  }, []);

  return (
    <div
      ref={domRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        'transition-all duration-700 ease-out transform',
        isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95',
        className
      )}
    >
      {children}
    </div>
  );
};

// ── REUSABLE UWO BRAND LOGO HEADER ──
const UwoBrandHeader = ({ align = 'left', dark = false }) => (
  <div className={cn("flex items-center gap-3 mb-2.5", align === 'center' && "justify-center")}>
    <div className="w-10 h-10 rounded-2xl bg-[#059669] flex items-center justify-center text-white shadow-md shadow-emerald-600/30 shrink-0">
      <Zap size={20} className="fill-white text-white" />
    </div>
    <div className="text-left">
      <h4 className={cn("text-lg font-black tracking-tight leading-none mb-1", dark ? "text-white" : "text-slate-900")}>
        UWO Connect
      </h4>
      <span className={cn("text-[10px] font-extrabold tracking-widest uppercase block leading-none", dark ? "text-emerald-400" : "text-[#059669]")}>
        AUTOMATED SAAS PLATFORM
      </span>
    </div>
  </div>
);

export default function UwoLandingPage() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(0);
  const [activeModuleIndex, setActiveModuleIndex] = useState(0);
  const [showWhiteLabelDetails, setShowWhiteLabelDetails] = useState(false);
  const section11Ref = useRef(null);

  // Real-time Scroll Observer to update active module index as user scrolls section 11
  useEffect(() => {
    const handleScroll = () => {
      if (!section11Ref.current) return;
      const rect = section11Ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Start tracking as soon as Section 11 top reaches 25% from top of viewport
      const startOffset = windowHeight * 0.25;
      const scrollableDistance = rect.height - windowHeight;
      if (scrollableDistance <= 0) return;

      const scrolled = startOffset - rect.top;
      const progress = Math.max(0, Math.min(0.999, scrolled / scrollableDistance));
      
      const newIndex = Math.floor(progress * 9);
      setActiveModuleIndex(newIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto playback for customer journey
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveWorkflowTab(prev => (prev + 1) % 6);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleStartFree = () => {
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500/20 selection:text-emerald-800">
      
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 1. STICKY GLASSY NAVBAR */}
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 1. STICKY GLASSY NAVBAR */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 transition-all duration-300 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group cursor-pointer">
            <img
              src="/download (3).gif"
              alt="UWO Connect Logo"
              className="w-10 h-10 rounded-2xl object-contain shadow-md shadow-emerald-600/30 group-hover:scale-105 transition-transform duration-300 shrink-0"
            />
            <div className="flex flex-col text-left">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none group-hover:text-[#059669] transition-colors mb-1">
                UWO Connect
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#059669] block leading-none">
                AUTOMATED SAAS PLATFORM
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-extrabold text-slate-600">
            <a href="#platform" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">Platform</a>
            <a href="#channels" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">Channels</a>
            <a href="#connectors" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">Connectors</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">How It Works</a>
            <a href="#pricing" className="hover:text-emerald-600 transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">Pricing</a>
            <a href="#white-label" className="hover:text-emerald-600 transition-colors relative py-1 flex items-center gap-1.5 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-emerald-600 hover:after:w-full after:transition-all after:duration-300">
              <span>White-Label</span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 text-[9px] font-black uppercase">Agency</span>
            </a>
          </nav>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer active:scale-95"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="landing-button-glow px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold shadow-md shadow-emerald-700/20 hover:shadow-lg hover:shadow-emerald-700/30 hover:scale-[1.03] active:scale-95 transition-all duration-300 flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION WITH PURE CODE WIRE CIRCUIT NETWORK (NO IMAGE) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative w-full pt-20 pb-28 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[85vh] flex items-center justify-center bg-gradient-to-b from-[#ecfdf5]/80 via-white to-emerald-50/40 border-b border-slate-200/70">
        
        {/* Pure SVG Animated Wire Circuit & Connection Nodes Background */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
          
          {/* Ambient Radial Soft Spotlights */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-emerald-400/20 rounded-full blur-[140px] animate-pulse" />
          <div className="absolute top-10 left-10 w-96 h-96 bg-teal-300/20 rounded-full blur-[110px]" />
          <div className="absolute top-10 right-10 w-96 h-96 bg-emerald-300/20 rounded-full blur-[110px]" />

          {/* Dot Matrix Grid */}
          <div className="absolute inset-0 bg-[radial-gradient(#059669_1.2px,transparent_1.2px)] [background-size:32px_32px] opacity-[0.14]" />

          {/* Pure SVG Circuit Wires & Glowing Nodes */}
          <svg className="absolute inset-0 w-full h-full opacity-40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#059669" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#0D9488" stopOpacity="0.8" />
              </linearGradient>
            </defs>

            {/* Horizontal Circuit Wires */}
            <path d="M 0 160 Q 300 200 600 160 T 1200 180 T 1920 160" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1.5" strokeDasharray="8 6" />
            <path d="M 0 320 Q 400 260 800 320 T 1600 280 T 1920 320" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1.5" strokeDasharray="10 8" />
            <path d="M 0 480 Q 500 520 1000 470 T 1800 500 T 1920 480" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1.5" strokeDasharray="6 6" />

            {/* Vertical Connecting Wires */}
            <path d="M 250 0 L 250 800" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
            <path d="M 500 0 L 500 800" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <path d="M 1420 0 L 1420 800" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.4" />
            <path d="M 1670 0 L 1670 800" fill="none" stroke="url(#emeraldGrad)" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />

            {/* Interconnected Glowing Junction Nodes */}
            <circle cx="250" cy="170" r="5" fill="#059669" />
            <circle cx="250" cy="170" r="10" fill="#059669" opacity="0.3" className="animate-ping" />

            <circle cx="600" cy="160" r="6" fill="#10B981" />
            <circle cx="600" cy="160" r="12" fill="#10B981" opacity="0.3" className="animate-ping" />

            <circle cx="800" cy="320" r="5" fill="#059669" />
            <circle cx="800" cy="320" r="10" fill="#059669" opacity="0.3" className="animate-ping" />

            <circle cx="1420" cy="290" r="6" fill="#0D9488" />
            <circle cx="1420" cy="290" r="12" fill="#0D9488" opacity="0.3" className="animate-ping" />

            <circle cx="1670" cy="480" r="5" fill="#059669" />
            <circle cx="1670" cy="480" r="10" fill="#059669" opacity="0.3" className="animate-ping" />
          </svg>
        </div>

        {/* Main Content (relative z-10) */}
        <div className="relative z-10 max-w-5xl mx-auto">
          
          {/* Hero Pill Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/95 border border-emerald-300 text-emerald-800 text-xs font-extrabold mb-8 shadow-sm hover:shadow-md transition-all">
            <Sparkles size={14} className="text-emerald-600 animate-pulse" />
            <span>Unified Communication + Business Automation Platform</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] max-w-5xl mx-auto italic font-serif text-[#064e3b] drop-shadow-xs"
            style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
          >
            <span>Connect Everything.</span> <br className="hidden sm:inline" />
            <span className="pr-2">
              Automate Anything.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-xl text-slate-700 font-bold max-w-2xl mx-auto mt-6 leading-relaxed">
            UWO Connect brings your communication channels, business tools, and automation into one intelligent workspace.
          </p>

          {/* Hero CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <button
              onClick={handleStartFree}
              className="landing-button-glow w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-extrabold shadow-xl shadow-emerald-700/25 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-1 hover:shadow-emerald-700/40 active:scale-95"
            >
              <span>Start Free</span>
              <ArrowRight size={18} />
            </button>

            <a
              href="#platform"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-700 text-sm font-extrabold shadow-sm hover:shadow-md transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-0.5 active:scale-95"
            >
              <span>Explore Platform</span>
              <ChevronRight size={18} />
            </a>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 4. ONE PLATFORM, THREE LAYERS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="relative py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-14 bg-gradient-to-br from-emerald-50/60 via-white to-slate-50/70 rounded-[2.5rem] border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Ambient Subtle Glow & Pattern */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center space-y-3 mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight italic font-serif"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Everything Your Business Needs. Connected in One Place.
            </h2>
            <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
              UWO Connect brings communication, productivity tools, and business automation together.
            </p>
          </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 1: CHANNELS */}
          <ScrollReveal delay={100}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 landing-card-hover shadow-xs hover:shadow-xl flex flex-col justify-between group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <MessageSquare size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Channels</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                    4 Channels
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Connect with customers wherever they are. WhatsApp, Instagram, Facebook, and YouTube.
                </p>
                
                <div className="flex items-center gap-2 pt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                  <WhatsAppLogo size={22} />
                  <InstagramLogo size={22} />
                  <FacebookLogo size={22} />
                  <YouTubeLogo size={22} />
                </div>
              </div>

              <a href="#channels" className="mt-8 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                <span>Explore Channels</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </ScrollReveal>

          {/* CARD 2: CONNECTORS */}
          <ScrollReveal delay={250}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 landing-card-hover shadow-xs hover:shadow-xl flex flex-col justify-between group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Share2 size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-700 transition-colors">Connectors</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase">
                    8 Connectors
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Connect your everyday business tools, files, maps, spreadsheets, and data sources.
                </p>
                
                <div className="flex items-center gap-2 pt-2 group-hover:scale-105 transition-transform duration-300 origin-left">
                  <GmailLogo size={20} />
                  <OutlookLogo size={20} />
                  <GoogleSheetsLogo size={20} />
                  <GoogleDocsLogo size={20} />
                </div>
              </div>

              <a href="#connectors" className="mt-8 text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                <span>Explore Connectors</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </ScrollReveal>

          {/* CARD 3: AUTOMATION MODULES */}
          <ScrollReveal delay={400}>
            <div className="p-8 rounded-3xl bg-white border border-slate-200 landing-card-hover shadow-xs hover:shadow-xl flex flex-col justify-between group cursor-pointer h-full">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                  <Zap size={24} />
                </div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-purple-700 transition-colors">Business Automation</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                    9 Modules
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Turn conversations and business data into automated lead creation, quotations, payments, and invoices.
                </p>
                
                <div className="flex flex-wrap items-center gap-1.5 pt-2">
                  <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-purple-800 text-[10px] font-bold rounded transition-colors">CRM</span>
                  <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-purple-800 text-[10px] font-bold rounded transition-colors">Auto Reply</span>
                  <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-purple-800 text-[10px] font-bold rounded transition-colors">Quotation</span>
                  <span className="px-2 py-0.5 bg-slate-100 group-hover:bg-purple-50 text-slate-700 group-hover:text-purple-800 text-[10px] font-bold rounded transition-colors">Invoice</span>
                </div>
              </div>

              <a href="#features" className="mt-8 text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 group-hover:translate-x-1.5 transition-transform">
                <span>Explore Features</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </ScrollReveal>

        </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 5. CHANNELS SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="channels" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 rounded-3xl border border-slate-200/80 my-10">
        <div className="text-center space-y-3 mb-12">
          <h2 
            className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight italic font-serif"
            style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
          >
            Meet Your Customers Where They Are
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Manage conversations across your most important communication channels from one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WHATSAPP */}
          <ScrollReveal delay={100}>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 landing-card-hover space-y-3 shadow-2xs group cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <WhatsAppLogo size={28} />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">WhatsApp</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Engage customers through automated conversations and official business messaging.
              </p>
            </div>
          </ScrollReveal>

          {/* INSTAGRAM */}
          <ScrollReveal delay={200}>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 landing-card-hover space-y-3 shadow-2xs group cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <InstagramLogo size={28} />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Instagram</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Manage customer interactions and social conversations from one unified workspace.
              </p>
            </div>
          </ScrollReveal>

          {/* FACEBOOK */}
          <ScrollReveal delay={300}>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 landing-card-hover space-y-3 shadow-2xs group cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <FacebookLogo size={28} />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">Facebook</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Bring Facebook Messenger conversations into your unified communication workflow.
              </p>
            </div>
          </ScrollReveal>

          {/* YOUTUBE */}
          <ScrollReveal delay={400}>
            <div className="p-6 rounded-2xl bg-white border border-slate-200 landing-card-hover space-y-3 shadow-2xs group cursor-pointer h-full">
              <div className="flex items-center justify-between">
                <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <YouTubeLogo size={28} />
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
                </span>
              </div>
              <h4 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">YouTube</h4>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Connect your YouTube presence and keep communication within your workflow.
              </p>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 6. CONNECTORS SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="connectors" className="relative py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-14 bg-gradient-to-br from-slate-50/90 via-white to-teal-50/60 rounded-[2.5rem] border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#0d9488_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center space-y-4 mb-16">
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight italic font-serif leading-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Connect the Tools Your Business Already Uses
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              Bring your emails, documents, spreadsheets, maps, and business data into the same workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7">
            {[
              { logo: <GmailLogo size={34} />, name: 'Gmail', desc: 'Email communication' },
              { logo: <OutlookLogo size={34} />, name: 'Microsoft Outlook', desc: 'Business email' },
              { logo: <Layers size={30} className="text-emerald-600" />, name: 'Google Maps', desc: 'Location intelligence' },
              { logo: <GoogleDocsLogo size={34} />, name: 'Google Docs', desc: 'Documents & workflows' },
              { logo: <Share2 size={30} className="text-blue-500" />, name: 'OneDrive', desc: 'Cloud files' },
              { logo: <GoogleSheetsLogo size={34} />, name: 'Google Sheets', desc: 'Business data & records' },
              { logo: <FileText size={30} className="text-amber-500" />, name: 'Google Slides', desc: 'Presentations' },
              { logo: <MessageSquare size={30} className="text-cyan-600" />, name: 'Google News Feed', desc: 'News & information' },
            ].map((item, idx) => (
              <ScrollReveal key={idx} delay={idx * 80}>
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 flex items-center gap-4.5 shadow-sm hover:border-emerald-500 hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 transition-all duration-300 group cursor-pointer h-full">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-emerald-50 group-hover:border-emerald-200 transition-all duration-300">
                    {item.logo}
                  </div>
                  <div className="text-left overflow-hidden">
                    <h5 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors truncate">{item.name}</h5>
                    <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 7. AUTOMATION MODULES SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto bg-gradient-to-b from-emerald-50/80 via-white to-emerald-50/40 rounded-[2.5rem] border border-emerald-200/90 my-16 shadow-xl">
        <div className="text-center space-y-4 mb-16">
          <h2 
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight italic font-serif leading-tight"
            style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
          >
            From Conversation to Completion — Automatically
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Turn everyday business activity into automated workflows.
          </p>
        </div>

        {/* Interactive Automation Chain Workflow Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4.5 max-w-7xl mx-auto">
          {[
            { step: 'STEP 01', icon: <MessageSquare size={22} />, label: 'Customer Message', desc: 'WhatsApp / DM query received', bg: 'bg-[#25D366]', border: 'hover:border-[#25D366]' },
            { step: 'STEP 02', icon: <Users size={22} />, label: 'CRM Lead Created', desc: 'Auto-saved to sales pipeline', bg: 'bg-[#059669]', border: 'hover:border-emerald-600' },
            { step: 'STEP 03', icon: <Bot size={22} />, label: 'AI Auto Reply', desc: 'Catalog & price bot dispatches', bg: 'bg-indigo-600', border: 'hover:border-indigo-600' },
            { step: 'STEP 04', icon: <FileCheck size={22} />, label: 'Quotation Generated', desc: 'Instant GST quotation PDF', bg: 'bg-amber-600', border: 'hover:border-amber-600' },
            { step: 'STEP 05', icon: <CreditCard size={22} />, label: 'Payment Link Sent', desc: 'Native Razorpay UPI link', bg: 'bg-rose-600', border: 'hover:border-rose-600' },
            { step: 'STEP 06', icon: <Receipt size={22} />, label: 'Invoice Issued', desc: 'Synced to Google Sheets', bg: 'bg-emerald-600', border: 'hover:border-emerald-600' },
            { step: 'STEP 07', icon: <CheckCircle2 size={22} />, label: 'Workflow Completed', desc: 'Closed deal in 0.2s', bg: 'bg-slate-900', border: 'hover:border-slate-900' }
          ].map((item, idx) => (
            <ScrollReveal key={idx} delay={idx * 90}>
              <div 
                className={cn(
                  "p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-center flex flex-col items-center justify-between relative overflow-hidden h-full",
                  item.border
                )}
              >
                {/* Subtle top indicator bar */}
                <div className={cn("absolute top-0 left-0 right-0 h-1.5 opacity-80 group-hover:opacity-100 transition-opacity", item.bg)} />

                <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">
                  {item.step}
                </span>

                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 group-hover:rotate-6 transition-all duration-300", item.bg)}>
                  {item.icon}
                </div>

                <h5 className="text-sm font-black text-slate-900 group-hover:text-emerald-700 transition-colors leading-tight mb-1">
                  {item.label}
                </h5>

                <p className="text-[11px] text-slate-500 font-medium leading-snug">
                  {item.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* 8. HOW UWO CONNECT WORKS - CONNECTED PIPELINE */}
      <section id="how-it-works" className="relative py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-14 bg-gradient-to-br from-emerald-50/50 via-white to-indigo-50/40 rounded-[2.5rem] border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Ambient Subtle Glow & Pattern */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center space-y-4 mb-16">
            <UwoBrandHeader align="center" />
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight italic font-serif leading-tight"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              How UWO Connect Works
            </h2>
            <p className="text-base sm:text-lg text-slate-500 font-medium max-w-xl mx-auto">
              3 simple steps to transform manual customer tasks into automated revenue pipelines.
            </p>
          </div>

          {/* Connected Pipeline Steps Container */}
          <div className="relative">
          {/* Connecting Glow Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-[15%] right-[15%] h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-indigo-600 -translate-y-1/2 z-0 rounded-full opacity-60 animate-pulse" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            
            {/* Step 01 */}
            <ScrollReveal delay={150}>
              <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-left flex flex-col justify-between space-y-5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold uppercase tracking-widest text-emerald-600 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80">
                    Step 01
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Zap size={24} className="fill-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">CONNECT</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Connect your communication channels (WhatsApp, Instagram, Gmail) and business tools in minutes.
                  </p>
                </div>

                {/* Connecting Pipeline Connector Arrow (Desktop) */}
                <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-emerald-600 text-white items-center justify-center shadow-lg shadow-emerald-600/30 group-hover:scale-125 transition-transform duration-300 border-2 border-white">
                  <ArrowRight size={18} />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 02 */}
            <ScrollReveal delay={300}>
              <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-left flex flex-col justify-between space-y-5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold uppercase tracking-widest text-indigo-600 px-3.5 py-1 rounded-full bg-indigo-50 border border-indigo-200/80">
                    Step 02
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Bot size={24} className="fill-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">AUTOMATE</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Create intelligent AI workflows that handle lead qualification, quotations, and repetitive replies automatically.
                  </p>
                </div>

                {/* Connecting Pipeline Connector Arrow (Desktop) */}
                <div className="hidden md:flex absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-indigo-600 text-white items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-125 transition-transform duration-300 border-2 border-white">
                  <ArrowRight size={18} />
                </div>
              </div>
            </ScrollReveal>

            {/* Step 03 */}
            <ScrollReveal delay={450}>
              <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer text-left flex flex-col justify-between space-y-5 h-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold uppercase tracking-widest text-emerald-600 px-3.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80">
                    Step 03
                  </span>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                    <Sparkles size={24} className="fill-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-emerald-700 transition-colors mb-2">GROW</h3>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">
                    Spend zero time switching between disconnected tools and focus on scaling your business revenue.
                  </p>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 9. REAL-WORLD AUTOMATION EXAMPLE - DYNAMIC SHOWCASE CARD */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white rounded-[2.5rem] my-12 shadow-2xl hover:shadow-emerald-950/70 transition-shadow duration-500 border border-slate-800/80 overflow-hidden">
        
        {/* Ambient Glowing Gradient Orbs & Tech Dot Matrix Grid Background */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-15 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center space-y-4 mb-16">
            <UwoBrandHeader align="center" dark />
            <h2 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight italic font-serif leading-tight drop-shadow-md"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              See Automation in Action
            </h2>
            <p className="text-base sm:text-lg text-slate-400 font-medium max-w-xl mx-auto">
              Click any step to see how UWO Connect handles customer conversations automatically.
            </p>
          </div>

        {/* Step-by-Step Interactive Playback & Large Showcase Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto text-left">
          
          {/* Left Side: 6 Interactive Step Options */}
          <div className="lg:col-span-5 space-y-3 flex flex-col justify-center">
            {[
              { title: 'Customer sends WhatsApp message', desc: '"Hi! I want to know the price of your product."' },
              { title: 'UWO Connect detects incoming conversation', desc: 'Channel message routed to Unified Engine' },
              { title: 'CRM Lead Created Automatically', desc: 'New contact record saved to lead pipeline' },
              { title: 'Auto Reply Dispatches Catalog', desc: 'Interactive catalog & PDF shared instantly' },
              { title: 'Quotation Automatically Prepared', desc: 'Quotation #QT-9482 created' },
              { title: 'Payment Link & Invoice Issued', desc: 'UPI payment link generated & GST Invoice saved' }
            ].map((st, i) => (
              <div
                key={i}
                onClick={() => setActiveWorkflowTab(i)}
                className={cn(
                  "p-4 sm:p-4.5 rounded-2xl border transition-all duration-300 cursor-pointer transform hover:translate-x-1.5 flex items-center justify-between",
                  activeWorkflowTab === i
                    ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-[1.02]"
                    : "bg-slate-800/50 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-600 hover:bg-slate-800/80"
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider", activeWorkflowTab === i ? "bg-emerald-500 text-slate-950" : "bg-slate-700 text-slate-300")}>
                      0{i + 1}
                    </span>
                    <h5 className="text-xs sm:text-sm font-bold">{st.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 pl-7">{st.desc}</p>
                </div>

                {activeWorkflowTab === i && (
                  <CheckCircle2 size={18} className="text-emerald-400 shrink-0 ml-2 animate-pulse" />
                )}
              </div>
            ))}
          </div>

          {/* Right Side: LARGE DESCRIPTIVE SHOWCASE CARD */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl flex flex-col justify-between relative overflow-hidden min-h-[420px]">
            {/* Top Bar */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-extrabold tracking-widest uppercase border",
                activeWorkflowTab === 0 && "bg-[#25D366]/15 text-[#25D366] border-[#25D366]/40",
                activeWorkflowTab === 1 && "bg-indigo-500/15 text-indigo-400 border-indigo-500/40",
                activeWorkflowTab === 2 && "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
                activeWorkflowTab === 3 && "bg-purple-500/15 text-purple-400 border-purple-500/40",
                activeWorkflowTab === 4 && "bg-amber-500/15 text-amber-400 border-amber-500/40",
                activeWorkflowTab === 5 && "bg-rose-500/15 text-rose-400 border-rose-500/40"
              )}>
                Step 0{activeWorkflowTab + 1} Workflow Node
              </span>

              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" /> LIVE SHOWCASE
              </span>
            </div>

            {/* Dynamic Step Description Header */}
            <div className="space-y-2 mb-6">
              <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                {[
                  'Customer Sends WhatsApp Message',
                  'UWO Connect Detects & Routes Message',
                  'CRM Lead Created Automatically',
                  'Auto Reply Dispatches Interactive Catalog',
                  'Quotation Automatically Prepared',
                  'Payment Link & Invoice Issued'
                ][activeWorkflowTab]}
              </h3>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">
                {[
                  'Inbound customer query arrives via official WhatsApp Business API.',
                  'AI Orchestration Engine analyzes intent, sentiment, and routes payload in 0.02 seconds.',
                  'New customer contact and deal record created instantly without manual data entry.',
                  'Personalized catalog, PDF brochure, and quick links sent back to customer WhatsApp.',
                  'System generates official GST quotation PDF with items, discount, and taxes.',
                  'UPI Payment link generated, payment verified, and final GST Invoice synced to Google Sheets.'
                ][activeWorkflowTab]}
              </p>
            </div>

            {/* Dynamic Live Mockup Visual Preview */}
            <div className="flex-1">
              {activeWorkflowTab === 0 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 text-left">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <WhatsAppLogo size={16} /> WhatsApp Business API
                    </span>
                    <span>14:02 PM • Just Now</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-100 text-xs leading-relaxed">
                    "Hi! I want to know the pricing and features of your UWO Connect Pro Plan."
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 font-medium">Customer Name</span>
                      <p className="font-bold text-slate-200">Rahul Sharma</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <span className="text-slate-500 font-medium">Phone Number</span>
                      <p className="font-bold text-slate-200">+91 98765 43210</p>
                    </div>
                  </div>
                </div>
              )}

              {activeWorkflowTab === 1 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/30 space-y-3 text-left font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-indigo-400 font-bold flex items-center gap-1.5"><Bot size={16} /> AI Intent Analysis</span>
                    <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px]">99.8% Confidence</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-indigo-950/40 border border-indigo-500/20 text-indigo-200 text-[11px] leading-relaxed space-y-1">
                    <p>Detected Intent: <span className="text-white font-bold">Pricing_Inquiry</span></p>
                    <p>Extracted Channel: <span className="text-white font-bold">WhatsApp_Inbound</span></p>
                    <p>Priority Score: <span className="text-emerald-400 font-bold">98/100 (Hot Lead)</span></p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Target Route</span>
                    <span className="text-emerald-400 font-bold">Sales & Quotation Engine</span>
                  </div>
                </div>
              )}

              {activeWorkflowTab === 2 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/30 space-y-3 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-400 font-bold text-xs flex items-center gap-1.5"><Users size={16} /> Unified CRM Record</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">Deal Stage: New Lead</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500">Contact</span>
                      <p className="font-bold text-white">Rahul Sharma</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                      <span className="text-[10px] text-slate-500">Source</span>
                      <p className="font-bold text-emerald-400">WhatsApp Direct</p>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between">
                    <span>Assigned Sales Agent</span>
                    <span className="text-indigo-400 font-bold">AI Assistant Core</span>
                  </div>
                </div>
              )}

              {activeWorkflowTab === 3 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/30 space-y-3 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-purple-400 font-bold flex items-center gap-1.5"><MessageSquare size={16} /> Automated Bot Reply</span>
                    <span className="text-[10px] text-slate-500">Dispatched in 0.4s</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 leading-relaxed text-[11px]">
                    "Hello Rahul! 👋 Thanks for reaching out to UWO Connect. Here is our official product catalog and plan details."
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-2 rounded-xl bg-purple-600/30 text-purple-200 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1.5">
                      📄 UWO_Connect_Catalog.pdf
                    </span>
                  </div>
                </div>
              )}

              {activeWorkflowTab === 4 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-amber-400 font-bold flex items-center gap-1.5"><FileCheck size={16} /> Official Quotation #QT-9482</span>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">Status: Active</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                    <div className="flex justify-between text-slate-300">
                      <span>UWO Connect Pro Plan (12 Mo)</span>
                      <span className="font-bold">₹49,999.00</span>
                    </div>
                    <div className="flex justify-between text-slate-400 text-[10px]">
                      <span>GST (18%)</span>
                      <span>₹8,999.82</span>
                    </div>
                    <div className="pt-2 border-t border-slate-800 flex justify-between font-bold text-white text-xs">
                      <span>Total Amount</span>
                      <span className="text-amber-400">₹58,998.82</span>
                    </div>
                  </div>
                </div>
              )}

              {activeWorkflowTab === 5 && (
                <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/30 space-y-3 text-left text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-bold flex items-center gap-1.5"><Receipt size={16} /> GST Invoice #INV-2026-8812</span>
                    <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">Paid via UPI</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-[11px]">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>UPI Payment Link</span>
                      <span className="text-rose-400 font-bold">pay.uwoconnect.com/qt9482</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 text-[10px] font-mono pt-1 border-t border-slate-800">
                      <span>✓ Synced to Google Sheets & Tally</span>
                      <span>0.2s</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Status Progress Indicator */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono mt-4">
              <span>Status: <strong className="text-emerald-400">Node Active</strong></span>
              <span>Workflow Progress: <strong className="text-white">{Math.round(((activeWorkflowTab + 1) / 6) * 100)}%</strong></span>
            </div>
          </div>

        </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 10. UNIFIED WORKSPACE SECTION (CHAOS VS CONNECTED) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-14 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 rounded-[2.5rem] border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Ambient Subtle Glow & Pattern */}
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <div className="text-center space-y-3 mb-12">
            <h2 
              className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight italic font-serif"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Stop Switching Between Tools
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* WITHOUT UWO CONNECT */}
            <div className="p-8 rounded-3xl bg-rose-50/60 border border-rose-200 text-left space-y-4 hover:border-rose-300 hover:shadow-lg transition-all duration-300">
              <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full">
                Without UWO Connect
              </span>
              <h4 className="text-lg font-black text-slate-900">Disconnected Chaos</h4>
              <p className="text-xs text-slate-600 font-medium">
                10 browser tabs, manual copy-pasting, lost leads, delayed replies, and chaotic manual invoicing.
              </p>
            </div>

            {/* WITH UWO CONNECT */}
            <div className="p-8 rounded-3xl bg-emerald-50/60 border border-emerald-200 text-left space-y-4 landing-card-hover">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
                With UWO Connect
              </span>
              <h4 className="text-lg font-black text-slate-900">One Clean Central Workspace</h4>
              <p className="text-xs text-slate-600 font-medium">
                Messages, Leads, Documents, Quotations, Payments, and Invoices automatically synced in real time.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 11. FEATURE SHOWCASE - SINGLE DYNAMIC CARD WITH ZERO WHITE SPACE GAP */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section 
        onWheel={(e) => {
          if (e.deltaY > 0 && activeModuleIndex < 8) {
            e.preventDefault();
            setActiveModuleIndex(prev => Math.min(8, prev + 1));
          } else if (e.deltaY < 0 && activeModuleIndex > 0) {
            e.preventDefault();
            setActiveModuleIndex(prev => Math.max(0, prev - 1));
          }
        }}
        className="relative py-12 sm:py-16 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: HEADING & 4-OPTION SLIDING WINDOW */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6 text-left h-full">
            <div className="space-y-4">
              <UwoBrandHeader align="left" />
              <h2 
                className="text-4xl sm:text-5xl font-bold text-slate-900 tracking-tight italic font-serif leading-[1.15]"
                style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
              >
                Everything You Need to Run Smarter
              </h2>

              <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-md">
                9 powerful business engines built natively into your unified workspace. Scroll down to explore each module.
              </p>

              {/* 4-Item Window Selector (Shows ONLY 4 OPTIONS AT A TIME) */}
              <div className="grid grid-cols-1 gap-2.5 pt-3 border-t border-slate-200/80 max-w-xs transition-all duration-300">
                {(() => {
                  const allOptions = [
                    { num: '01', title: 'Team Dashboard', index: 0 },
                    { num: '02', title: 'Unified CRM', index: 1 },
                    { num: '03', title: 'Smart AI Auto Reply', index: 2 },
                    { num: '04', title: 'Quotation Generator', index: 3 },
                    { num: '05', title: 'GST Invoicing Engine', index: 4 },
                    { num: '06', title: 'Proposal & Deals', index: 5 },
                    { num: '07', title: 'Product Catalog', index: 6 },
                    { num: '08', title: 'Payment Integration', index: 7 },
                    { num: '09', title: 'Voice & Video Calling', index: 8 },
                  ];

                  const startIndex = Math.min(Math.max(0, activeModuleIndex - 1), 5);
                  const visibleList = allOptions.slice(startIndex, startIndex + 4);

                  return visibleList.map((item) => {
                    const isActive = item.index === activeModuleIndex;

                    return (
                      <button 
                        key={item.index} 
                        onClick={() => setActiveModuleIndex(item.index)}
                        className={cn(
                          "flex items-center gap-2.5 text-xs font-bold transition-all duration-300 rounded-xl border px-3.5 py-2.5 text-left cursor-pointer",
                          isActive
                            ? "bg-[#059669] text-white border-emerald-600 shadow-lg shadow-emerald-600/25 translate-x-2 font-extrabold scale-[1.02]"
                            : "bg-slate-50/80 border-slate-200/70 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60"
                        )}
                      >
                        <span className={cn("w-2 h-2 rounded-full shrink-0 transition-colors", isActive ? "bg-white animate-ping" : "bg-emerald-500/50")} />
                        <span className="truncate">{item.num}. {item.title}</span>
                      </button>
                    );
                  });
                })()}
              </div>
            </div>

            <div className="pt-2">
              <button 
                onClick={() => router.push('/auth/login')}
                className="landing-button-glow px-6 py-3.5 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold shadow-lg shadow-emerald-700/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* Right Column: SINGLE DISPLAY CARD WITH EXACT SAME HEIGHT AS LEFT COLUMN */}
          <div className="lg:col-span-7 flex">
            {(() => {
              const modulesList = [
                { 
                  num: '01',
                  icon: <LayoutDashboard size={26} />, 
                  title: 'Team Dashboard', 
                  desc: 'Keep team tasks, channel feeds, and automated business activity organized in one central hub with real-time updates and live activity monitoring.', 
                  tag: 'CORE ENGINE', 
                  tagStyle: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
                  iconBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20',
                  features: ['Multi-user Team Permissions', 'Real-time Feed Sync', 'Role-Based Access'],
                  previewText: '🚀 Active Sessions: 14 Agents Online • 2,480 Automation Events Processed Today • 0 Pending Escalations'
                },
                { 
                  num: '02',
                  icon: <Users size={26} />, 
                  title: 'Unified CRM', 
                  desc: 'Auto-capture customer leads from WhatsApp, Instagram DMs, and contact forms directly into visual sales pipeline stages with smart tags.', 
                  tag: 'SALES PIPELINE', 
                  tagStyle: 'bg-teal-500/10 text-teal-700 border-teal-500/30',
                  iconBg: 'bg-gradient-to-br from-teal-500 to-emerald-600 shadow-teal-500/20',
                  features: ['Automated Lead Scoring', 'Custom Deal Pipeline', 'Contact History Log'],
                  previewText: '👤 New Lead Captured: Rohan Sharma (+91 98765-XXXX) → Tagged as "High Intent Enterprise" → Moved to Stage: Proposal Sent'
                },
                { 
                  num: '03',
                  icon: <Bot size={26} />, 
                  title: 'Smart AI Auto Reply', 
                  desc: 'Instant 24/7 customer response bot with intelligent catalog lookup, FAQs resolution, and automated lead qualification without human delay.', 
                  tag: '24/7 AI AGENT', 
                  tagStyle: 'bg-indigo-500/10 text-indigo-700 border-indigo-500/30',
                  iconBg: 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-indigo-500/20',
                  features: ['0.2s Instant Dispatch', 'Multi-lingual Understanding', 'Human Handover Mode'],
                  previewText: '💬 Customer: "Do you offer GST invoices for enterprise plans?" → AI Bot (0.2s): "Yes! GST tax invoices are generated automatically."'
                },
                { 
                  num: '04',
                  icon: <FileCheck size={26} />, 
                  title: 'Quotation Generator', 
                  desc: 'Create, customize, and dispatch professional PDF GST quotations directly to customer chat conversations in seconds.', 
                  tag: 'INSTANT PDF', 
                  tagStyle: 'bg-amber-500/10 text-amber-800 border-amber-500/30',
                  iconBg: 'bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20',
                  features: ['GST & HSN Tax Calculation', 'Dynamic Discounting', 'Instant WhatsApp Share'],
                  previewText: '📄 Generated Quotation #QT-2026-8890 for ₹45,000 + 18% GST → Auto-dispatched as PDF to WhatsApp chat.'
                },
                { 
                  num: '05',
                  icon: <Receipt size={26} />, 
                  title: 'GST Invoicing Engine', 
                  desc: 'Generate official GST tax invoices automatically upon successful payment and sync records directly to Google Sheets & Tally.', 
                  tag: 'TAX & ACCOUNTING', 
                  tagStyle: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
                  iconBg: 'bg-gradient-to-br from-emerald-600 to-green-600 shadow-emerald-500/20',
                  features: ['Automatic PDF Issuance', 'Google Sheets & Tally Sync', 'Tax Audit Compliance'],
                  previewText: '🧾 Invoice #INV-8910 Issued • Amount: ₹53,100 Incl. GST • Auto-synced to Google Sheets Row #1,420 & Tally ERP'
                },
                { 
                  num: '06',
                  icon: <FileText size={26} />, 
                  title: 'Proposal & Deals', 
                  desc: 'Design high-converting business proposals with custom pricing tables, e-signature links, and real-time open notifications.', 
                  tag: 'CONTRACTS', 
                  tagStyle: 'bg-purple-500/10 text-purple-700 border-purple-500/30',
                  iconBg: 'bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20',
                  features: ['Real-time View Tracking', 'E-Signature Ready', 'Interactive Pricing Tables'],
                  previewText: '🔔 Notification: Client opened Proposal "Enterprise Automation Suite v2" (Spent 4 mins 12 secs viewing pricing section)'
                },
                { 
                  num: '07',
                  icon: <ShoppingBag size={26} />, 
                  title: 'Product & Service Catalog', 
                  desc: 'Present digital product catalogs with rich images, descriptions, pricing, and 1-click WhatsApp order checkout links.', 
                  tag: 'E-COMMERCE', 
                  tagStyle: 'bg-cyan-500/10 text-cyan-700 border-cyan-500/30',
                  iconBg: 'bg-gradient-to-br from-cyan-500 to-blue-600 shadow-cyan-500/20',
                  features: ['Interactive Category Grid', '1-Click WhatsApp Cart', 'Live Stock Sync'],
                  previewText: '🛍️ Catalog Link Dispatched → Customer selected 2 Items (Total ₹12,499) → Checkout initiated via WhatsApp'
                },
                { 
                  num: '08',
                  icon: <CreditCard size={26} />, 
                  title: 'Payment Integration', 
                  desc: 'Connect Razorpay, PhonePe, and UPI payment actions directly into your business chat workflow for 0-friction sales.', 
                  tag: 'RAZORPAY UPI', 
                  tagStyle: 'bg-rose-500/10 text-rose-700 border-rose-500/30',
                  iconBg: 'bg-gradient-to-br from-rose-500 to-red-600 shadow-rose-500/20',
                  features: ['Native UPI Link Dispatch', 'Instant Payment Verification', 'Auto Webhook Triggers'],
                  previewText: '💳 Payment Link Generated via Razorpay UPI → Webhook Received: Payment Verified ₹12,499 → Order Confirmed!'
                },
                { 
                  num: '09',
                  icon: <Video size={26} />, 
                  title: 'Voice & Video Calling', 
                  desc: 'Engage high-intent customers through crystal-clear HD WebRTC voice and video calls directly inside the web browser without any download.', 
                  tag: 'LIVE MEDIA', 
                  tagStyle: 'bg-blue-500/10 text-blue-700 border-blue-500/30',
                  iconBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/20',
                  features: ['In-Browser HD Video', 'Call Recording Logs', 'Screen Share Support'],
                  previewText: '📞 In-Browser WebRTC Call Connected • Duration: 12m 45s • Audio Quality: 1080p Crystal Clear • Call Log Saved to Lead Profile'
                },
              ];

              const currentModule = modulesList[activeModuleIndex] || modulesList[0];

              return (
                <div key={activeModuleIndex} className="p-7 sm:p-8 rounded-[2.5rem] bg-white border border-slate-200/90 shadow-2xl shadow-emerald-900/5 relative overflow-hidden text-left transition-all duration-500 flex flex-col justify-between w-full h-full">
                  
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600" />

                  <div className="space-y-5">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3.5">
                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20", currentModule.iconBg)}>
                          {currentModule.icon}
                        </div>
                        <div>
                          <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">MODULE {currentModule.num} OF 09</span>
                          <h3 
                            className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight italic font-serif"
                            style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                          >
                            {currentModule.title}
                          </h3>
                        </div>
                      </div>

                      <span className={cn("px-3 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase border hidden sm:inline-block", currentModule.tagStyle)}>
                        {currentModule.tag}
                      </span>
                    </div>

                    <p className="text-sm text-slate-600 font-medium leading-relaxed">
                      {currentModule.desc}
                    </p>

                    {/* Sub Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                      {currentModule.features.map((ft, fi) => (
                        <div key={fi} className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-[11px] font-bold text-emerald-900 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          <span className="truncate">{ft}</span>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Live Preview Mockup Box */}
                    <div className="p-5 rounded-2xl bg-slate-950 text-white space-y-2.5 border border-slate-800 shadow-inner mt-2">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono border-b border-slate-800/80 pb-1.5">
                        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          LIVE ENGINE LOG
                        </span>
                        <span>UWO CONNECT WORKSPACE</span>
                      </div>
                      <div className="text-xs font-medium text-slate-300 leading-relaxed font-mono">
                        {currentModule.previewText}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-4">
                    <div className="flex items-center gap-1.5">
                      {modulesList.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={() => setActiveModuleIndex(dotIdx)}
                          className={cn(
                            "h-2 rounded-full transition-all duration-300 cursor-pointer",
                            dotIdx === activeModuleIndex ? "w-8 bg-[#059669]" : "w-2 bg-slate-200 hover:bg-slate-300"
                          )}
                        />
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setActiveModuleIndex(prev => (prev > 0 ? prev - 1 : 8))}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => setActiveModuleIndex(prev => (prev < 8 ? prev + 1 : 0))}
                        className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })()}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 11.5 PRICING & SUBSCRIPTION PLANS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="relative py-20 px-6 sm:px-10 lg:px-12 max-w-7xl mx-auto my-16 text-center bg-gradient-to-br from-slate-50/90 via-white to-emerald-50/50 rounded-[2.5rem] border border-slate-200/90 shadow-xl overflow-hidden">
        
        {/* Ambient Glows */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10">
          <PricingComparisonTable onSelectPlan={() => router.push('/auth/login')} />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 12. WHITE-LABEL & AGENCY RESELLER PROGRAM - COMPACT & EXPANDABLE */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="white-label" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto my-16 bg-gradient-to-br from-slate-50 via-white to-emerald-50/40 text-slate-900 rounded-[2.5rem] shadow-xl border border-slate-200/90 overflow-hidden text-left transition-all duration-500">
        
        {/* Ambient Animated Glow & Pattern */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(#059669_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="relative z-10 space-y-12">
          
          {/* 1. HERO & MAIN HEADING (ALWAYS VISIBLE) */}
          <ScrollReveal>
            <div className="text-center max-w-4xl mx-auto space-y-6">
              <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 text-xs font-black tracking-widest uppercase inline-block animate-pulse">
                AGENCY RESELLER & WHITE-LABEL PARTNER PROGRAM
              </span>

              <h2 
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight italic font-serif leading-tight"
                style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
              >
                Build & Scale Your Own White-Label Software Agency
              </h2>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
                Rebrand our enterprise automation platform under your own company name, custom domain, and logo. Sell omni-channel automation, CRM, and AI bots directly to your clients — and keep <span className="text-[#059669] font-bold">100% of the profits</span>.
              </p>

              {/* CTAs & Micro-Proof */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={() => router.push('/auth/login')}
                  className="landing-button-glow px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-extrabold shadow-lg shadow-emerald-700/25 flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <span>🚀 Apply for Agency White-Label</span>
                  <ArrowRight size={18} />
                </button>

                <button 
                  onClick={() => router.push('/book')}
                  className="px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 text-sm font-bold shadow-xs hover:border-emerald-500 hover:scale-105 transition-all cursor-pointer"
                >
                  <span>📞 Book a Live Platform Demo</span>
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-800 font-bold pt-2">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#059669]" /> No Code Required</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#059669]" /> Keep 100% Revenue</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={16} className="text-[#059669]" /> Instant CNAME Setup</span>
              </div>

              {/* EXPLORE TOGGLE BUTTON */}
              <div className="pt-4">
                <button
                  onClick={() => setShowWhiteLabelDetails(!showWhiteLabelDetails)}
                  className="px-8 py-3.5 rounded-full bg-emerald-500/10 hover:bg-[#059669] border border-emerald-500/30 text-[#059669] hover:text-white text-xs font-black tracking-wider uppercase inline-flex items-center gap-2.5 transition-all hover:scale-105 shadow-md shadow-emerald-500/10 cursor-pointer group"
                >
                  <span>{showWhiteLabelDetails ? 'Hide Program Details' : 'Explore Program Details'}</span>
                  {showWhiteLabelDetails ? (
                    <ChevronUp size={18} />
                  ) : (
                    <ChevronDown size={18} className="animate-bounce text-[#059669] group-hover:text-white" />
                  )}
                </button>
              </div>
            </div>
          </ScrollReveal>

          {/* EXPANDABLE FULL DETAILS (SHOWN WHEN USER CLICKS EXPLORE PROGRAM DETAILS) */}
          {showWhiteLabelDetails && (
            <div className="space-y-16 pt-8 border-t border-slate-200/80 transition-all duration-500">
              
              {/* 2. HOW IT WORKS (4-STEP ONBOARDING JOURNEY) */}
              <div className="space-y-8">
                <ScrollReveal>
                  <div className="text-center space-y-2">
                    <span className="text-xs font-black tracking-widest text-[#059669] uppercase">4-STEP ONBOARDING JOURNEY</span>
                    <h3 
                      className="text-3xl sm:text-4xl font-bold text-slate-900 italic font-serif"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                    >
                      Launch Your SaaS Brand in 4 Simple Steps
                    </h3>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      step: 'Step 01',
                      title: 'Get Your Agency License',
                      desc: 'Choose an Agency White-Label license and get instant access to your master reseller command hub.'
                    },
                    {
                      step: 'Step 02',
                      title: 'Connect Custom Domain & Brand',
                      desc: 'Point your subdomain (e.g., portal.yourbrand.com) via CNAME, upload your logo, and set your theme color palette.'
                    },
                    {
                      step: 'Step 03',
                      title: 'Connect Payment Gateway',
                      desc: 'Plug in your own Razorpay account so that 100% of all client payments land directly into your own bank account.'
                    },
                    {
                      step: 'Step 04',
                      title: 'Invite & Bill Your Sub-Clients',
                      desc: 'Provision isolated workspaces for your clients, approve signups, and charge your own custom subscription prices.'
                    }
                  ].map((item, i) => (
                    <ScrollReveal key={i} delay={i * 120}>
                      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-md hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 space-y-3 relative group cursor-pointer h-full flex flex-col justify-between">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-emerald-800 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 uppercase tracking-wider group-hover:bg-[#059669] group-hover:text-white transition-colors">
                              {item.step}
                            </span>
                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:text-white group-hover:bg-[#059669] group-hover:scale-110 transition-all">
                              <CheckCircle2 size={16} />
                            </div>
                          </div>
                          <h4 className="text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{item.title}</h4>
                          <p className="text-xs text-slate-600 leading-relaxed font-medium">{item.desc}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* 3. WHAT THE AGENCY GETS (DELIVERABLES & PLATFORM FEATURES) */}
              <div className="space-y-8 border-t border-slate-200/80 pt-12">
                <ScrollReveal>
                  <div className="text-center space-y-2">
                    <span className="text-xs font-black tracking-widest text-[#059669] uppercase">AGENCY DELIVERABLES</span>
                    <h3 
                      className="text-3xl sm:text-4xl font-bold text-slate-900 italic font-serif"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                    >
                      Everything Included in Your White-Label Portal
                    </h3>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Feature Box A */}
                  <ScrollReveal delay={100}>
                    <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4 text-left hover:border-emerald-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-[#059669] flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Layers size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-[#059669] transition-colors">100% Custom-Branded Software</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-[#059669] font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Complete Whitelabeling:</strong> Your brand name, logo, favicon, and brand color theme.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#059669] font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Custom Subdomain:</strong> portal.yourbrand.com with free automatic SSL certificate.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-[#059669] font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Agency Admin Hub:</strong> Dedicated master dashboard (/client/agency) to approve, provision, and monitor sub-clients.</span>
                        </li>
                      </ul>
                    </div>
                  </ScrollReveal>

                  {/* Feature Box B */}
                  <ScrollReveal delay={200}>
                    <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4 text-left hover:border-teal-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <CreditCard size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors">100% Direct Profit & Billing Control</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Direct Gateway Integration:</strong> Connect your Razorpay; 0% platform revenue cut.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Custom Pricing:</strong> You decide how much to charge your clients (e.g., ₹2,999/mo or ₹9,999/mo).</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-teal-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Instant Payouts:</strong> Money goes directly from client to your connected bank account.</span>
                        </li>
                      </ul>
                    </div>
                  </ScrollReveal>

                  {/* Feature Box C */}
                  <ScrollReveal delay={300}>
                    <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4 text-left hover:border-indigo-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Zap size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">Full Enterprise Omni-Channel Suite</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>WhatsApp Cloud API Automation & Multi-Agent Team Inbox</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>Instagram & Facebook DM Auto-Replies & Story Triggers</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>Gmail & Outlook Two-Way Sync & Lead CRM Pipeline</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>Quotations, Proposals & Invoices Builder with PDF Generation</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-indigo-600 font-bold shrink-0">•</span>
                          <span>AI Knowledge Base Assistant trained on client documents</span>
                        </li>
                      </ul>
                    </div>
                  </ScrollReveal>

                  {/* Feature Box D */}
                  <ScrollReveal delay={400}>
                    <div className="p-8 rounded-3xl bg-white border border-slate-200/90 shadow-lg space-y-4 text-left hover:border-amber-500 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group cursor-pointer h-full">
                      <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ShieldCheck size={24} />
                      </div>
                      <h4 className="text-xl font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Zero Server & Maintenance Hassle</h4>
                      <ul className="space-y-2.5 text-xs text-slate-600 font-medium">
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Cloud Infrastructure Managed:</strong> 99.9% uptime, auto-scaling, and regular backups handled for you.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">Continuous Updates:</strong> All new connectors and feature updates automatically roll out to your brand.</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-amber-600 font-bold shrink-0">•</span>
                          <span><strong className="text-slate-900">24/7 Agency Priority Support:</strong> Dedicated partner team to support your growth.</span>
                        </li>
                      </ul>
                    </div>
                  </ScrollReveal>
                </div>
              </div>

              {/* 4. WHAT IS REQUIRED FROM THE AGENCY (PREREQUISITES CHECKLIST) */}
              <ScrollReveal>
                <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/90 space-y-6">
                  <div className="text-left space-y-2">
                    <span className="text-xs font-black tracking-widest text-[#059669] uppercase">PREREQUISITES CHECKLIST</span>
                    <h3 
                      className="text-2xl sm:text-3xl font-bold text-slate-900 italic font-serif"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                    >
                      What is Required From Your Agency
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
                    {[
                      {
                        title: '1. Brand Assets',
                        items: ['Company Brand Name', 'High-Resolution Logo (PNG/SVG)', 'Primary Brand Color (Hex code)']
                      },
                      {
                        title: '2. 1 Subdomain & DNS',
                        items: ['Add 1 CNAME record:', 'Host: portal', 'Points To: aisa24.com']
                      },
                      {
                        title: '3. Razorpay API Keys',
                        items: ['Razorpay Key ID', 'Razorpay Key Secret', '(100% direct payouts)']
                      },
                      {
                        title: '4. Agency License Fee',
                        items: ['Active White-Label Agency', 'Subscription License', 'with the platform']
                      }
                    ].map((req, ri) => (
                      <div key={ri} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#059669] hover:shadow-md transition-all duration-300 space-y-2 cursor-pointer group">
                        <span className="text-[#059669] font-black text-sm group-hover:scale-105 inline-block transition-transform">{req.title}</span>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium space-y-1">
                          {req.items.map((line, li) => (
                            <span key={li} className="block">{line}</span>
                          ))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              {/* 5. FREQUENTLY ASKED QUESTIONS (FAQ) */}
              <div className="space-y-6 border-t border-slate-200/80 pt-12">
                <ScrollReveal>
                  <div className="text-center space-y-2">
                    <span className="text-xs font-black tracking-widest text-[#059669] uppercase">AGENCY PARTNER FAQS</span>
                    <h3 
                      className="text-3xl sm:text-4xl font-bold text-slate-900 italic font-serif"
                      style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                    >
                      Frequently Asked Questions
                    </h3>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left max-w-5xl mx-auto">
                  {[
                    {
                      q: 'Will my clients know this is powered by another platform?',
                      a: 'No. Your white-label portal is 100% unbranded. Your clients will only see your custom brand name, logo, theme colors, and custom domain.'
                    },
                    {
                      q: 'Who collects the subscription payments from my clients?',
                      a: 'You do! Sub-clients pay directly through your connected Razorpay gateway. 100% of the money goes straight to your bank account.'
                    },
                    {
                      q: 'How do I approve new client signups?',
                      a: "When a client registers on your custom domain, they appear in your Agency Command Hub under 'Pending Approvals'. You can review and approve them in 1 click."
                    },
                    {
                      q: 'Do I need any coding knowledge or servers to run this?',
                      a: 'Zero coding required. If you can copy-paste a DNS record and upload a logo, your SaaS agency is ready to go.'
                    }
                  ].map((faq, fi) => (
                    <ScrollReveal key={fi} delay={fi * 100}>
                      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-300 space-y-2 cursor-pointer h-full">
                        <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                          <HelpCircle size={18} className="text-[#059669] shrink-0" />
                          <span>{faq.q}</span>
                        </h4>
                        <p className="text-xs text-slate-600 font-medium leading-relaxed pl-6">
                          {faq.a}
                        </p>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
              </div>

              {/* Bottom Banner CTA */}
              <ScrollReveal>
                <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-50/80 border border-emerald-200 text-center space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <h3 
                    className="text-3xl sm:text-4xl font-bold text-slate-900 italic font-serif"
                    style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
                  >
                    Ready to Launch Your Software Agency Today?
                  </h3>
                  <p className="text-sm text-slate-600 font-medium max-w-xl mx-auto">
                    Get your custom white-label domain configured in minutes. Rebrand, sell, and keep 100% of the revenue.
                  </p>
                  <div className="pt-2">
                    <button 
                      onClick={() => router.push('/auth/login')}
                      className="landing-button-glow px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-extrabold shadow-xl shadow-emerald-700/25 inline-flex items-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      <span>Apply for Agency White-Label License</span>
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </ScrollReveal>

            </div>
          )}

        </div>
      </section>


      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 13. FOOTER */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-left text-xs">
          
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-md shadow-emerald-600/20 flex items-center justify-center bg-white border border-emerald-500/30 p-0.5 shrink-0">
                <img
                  src="/download (3).gif"
                  alt="UWO Connect Logo"
                  className="w-full h-full object-cover rounded-xl"
                  width={40}
                  height={40}
                />
              </div>
              <span 
                className="text-xl font-bold tracking-tight text-slate-900 italic font-serif"
                style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
              >
                UWO <span className="text-[#059669]">Connect</span>
              </span>
            </div>
            
            <p className="text-slate-900 font-semibold max-w-sm leading-relaxed">
              Unified Communication & Business Automation Platform. Connect channels, tools, and workflows seamlessly.
            </p>

            {/* Social Media Brand Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:scale-110 hover:border-emerald-500 hover:shadow-md transition-all duration-300 cursor-pointer">
                <WhatsAppLogo size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:scale-110 hover:border-pink-500 hover:shadow-md transition-all duration-300 cursor-pointer">
                <InstagramLogo size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:scale-110 hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-pointer">
                <FacebookLogo size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl bg-white border border-slate-200 shadow-2xs hover:scale-110 hover:border-red-500 hover:shadow-md transition-all duration-300 cursor-pointer">
                <YouTubeLogo size={20} />
              </a>
            </div>
          </div>

          <div className="space-y-3">
            <h5 
              className="font-bold text-sm text-[#059669] italic font-serif"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Product
            </h5>
            <ul className="space-y-2 text-slate-900 font-bold">
              <li><a href="#channels" className="hover:text-emerald-700 transition-colors">Channels</a></li>
              <li><a href="#connectors" className="hover:text-emerald-700 transition-colors">Connectors</a></li>
              <li><a href="#features" className="hover:text-emerald-700 transition-colors">Features</a></li>
              <li><Link href="/client/plans" className="hover:text-emerald-700 transition-colors">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 
              className="font-bold text-sm text-[#059669] italic font-serif"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Company
            </h5>
            <ul className="space-y-2 text-slate-900 font-bold">
              <li><Link href="/about" className="hover:text-emerald-700 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-700 transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-emerald-700 transition-colors">Book Demo</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 
              className="font-bold text-sm text-[#059669] italic font-serif"
              style={{ fontFamily: "'Times New Roman', Times, serif", fontStyle: "italic" }}
            >
              Legal
            </h5>
            <ul className="space-y-2 text-slate-900 font-bold">
              <li><Link href="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-700 transition-colors">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-700 transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-200 text-center text-xs text-slate-900 font-semibold">
          © {new Date().getFullYear()} UWO Connect. All rights reserved. Unified Communication & Business Automation.
        </div>
      </footer>

      {/* Auth Modal Trigger */}
      {isLoginModalOpen && (
        <UWOLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      )}

    </div>
  );
}

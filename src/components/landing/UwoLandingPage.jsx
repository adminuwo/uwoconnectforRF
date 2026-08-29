'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Zap, MessageSquare, Share2, Layers, CheckCircle2, 
  LayoutDashboard, FileCheck, Receipt, FileText, ShoppingBag, 
  CreditCard, Users, Bot, Video, Sparkles, ArrowRight, ShieldCheck, 
  ChevronRight, RefreshCw, Check, Star, Lock, Globe, HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import AutomationNetwork from './AutomationNetwork';
import HeroWorkflowAnimation from './HeroWorkflowAnimation';
import UWOLoginModal from '@/components/UWOLoginModal';

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

export default function UwoLandingPage() {
  const router = useRouter();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [activeWorkflowTab, setActiveWorkflowTab] = useState(0);

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
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#059669] text-white flex items-center justify-center shadow-lg shadow-emerald-700/20">
              <Zap size={22} className="fill-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 leading-none">UWO Connect</span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mt-0.5">Automated SaaS Platform</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-extrabold text-slate-600">
            <a href="#platform" className="hover:text-emerald-600 transition-colors">Platform</a>
            <a href="#channels" className="hover:text-emerald-600 transition-colors">Channels</a>
            <a href="#connectors" className="hover:text-emerald-600 transition-colors">Connectors</a>
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">How It Works</a>
            <Link href="/client/plans" className="hover:text-emerald-600 transition-colors">Pricing</Link>
          </nav>

          {/* Auth CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.push('/auth/login')}
              className="px-4 py-2 text-xs font-extrabold text-slate-700 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Log In
            </button>
            <button
              onClick={() => router.push('/auth/login')}
              className="px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-extrabold shadow-md shadow-emerald-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Get Started</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 2. HERO SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        
        {/* Hero Pill Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-extrabold mb-6">
          <Sparkles size={14} className="text-emerald-600" />
          <span>Unified Communication + Business Automation Platform</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] max-w-5xl mx-auto">
          Connect Everything. <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#059669] via-emerald-600 to-teal-600">
            Automate Anything.
          </span>
        </h1>

        {/* Supporting Copy */}
        <p className="text-base sm:text-xl text-slate-600 font-medium max-w-2xl mx-auto mt-6 leading-relaxed">
          UWO Connect brings your communication channels, business tools, and automation into one intelligent workspace.
        </p>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          <button
            onClick={handleStartFree}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#059669] hover:bg-[#047857] text-white text-sm font-extrabold shadow-xl shadow-emerald-700/25 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
          >
            <span>Start Free</span>
            <ArrowRight size={18} />
          </button>

          <a
            href="#platform"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 text-slate-800 hover:text-emerald-700 text-sm font-extrabold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <span>Explore Platform</span>
            <ChevronRight size={18} />
          </a>
        </div>

        {/* Interactive Automation Network Canvas */}
        <div className="mt-12">
          <AutomationNetwork />
        </div>

        {/* Real-time Hero Workflow Simulator */}
        <div className="mt-8">
          <HeroWorkflowAnimation />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 3. TRUST / VALUE STRIP */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-10 bg-slate-50/80 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <p className="text-sm font-extrabold text-slate-700 max-w-sm">
            One platform. Multiple channels. Connected tools. Automated workflows.
          </p>

          <div className="grid grid-cols-3 gap-8 sm:gap-16">
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700">4</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Channels</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700">8</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Connectors</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-3xl sm:text-4xl font-black text-emerald-700">9</span>
              <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Automation Modules</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 4. ONE PLATFORM, THREE LAYERS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="platform" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            THREE LAYER ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything Your Business Needs. Connected in One Place.
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            UWO Connect brings communication, productivity tools, and business automation together.
          </p>
        </div>

        {/* 3 Interactive Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* CARD 1: CHANNELS */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <MessageSquare size={24} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Channels</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 uppercase">
                  4 Channels
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Connect with customers wherever they are. WhatsApp, Instagram, Facebook, and YouTube.
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                <WhatsAppLogo size={22} />
                <InstagramLogo size={22} />
                <FacebookLogo size={22} />
                <YouTubeLogo size={22} />
              </div>
            </div>

            <a href="#channels" className="mt-8 text-xs font-extrabold text-emerald-600 hover:text-emerald-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>Explore Channels</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* CARD 2: CONNECTORS */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Connectors</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800 uppercase">
                  8 Connectors
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Connect your everyday business tools, files, maps, spreadsheets, and data sources.
              </p>
              
              <div className="flex items-center gap-2 pt-2">
                <GmailLogo size={20} />
                <OutlookLogo size={20} />
                <GoogleSheetsLogo size={20} />
                <GoogleDocsLogo size={20} />
              </div>
            </div>

            <a href="#connectors" className="mt-8 text-xs font-extrabold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>Explore Connectors</span>
              <ArrowRight size={14} />
            </a>
          </div>

          {/* CARD 3: AUTOMATION MODULES */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-200 text-purple-600 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Business Automation</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-800 uppercase">
                  9 Modules
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Turn conversations and business data into automated lead creation, quotations, payments, and invoices.
              </p>
              
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">CRM</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">Auto Reply</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">Quotation</span>
                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded">Invoice</span>
              </div>
            </div>

            <a href="#features" className="mt-8 text-xs font-extrabold text-purple-600 hover:text-purple-700 flex items-center gap-1.5 group-hover:translate-x-1 transition-transform">
              <span>Explore Features</span>
              <ArrowRight size={14} />
            </a>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 5. CHANNELS SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="channels" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/50 rounded-3xl border border-slate-200/80 my-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            COMMUNICATION LAYER
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Meet Your Customers Where They Are
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Manage conversations across your most important communication channels from one unified platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* WHATSAPP */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <WhatsAppLogo size={28} />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900">WhatsApp</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Engage customers through automated conversations and official business messaging.
            </p>
          </div>

          {/* INSTAGRAM */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <InstagramLogo size={28} />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900">Instagram</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Manage customer interactions and social conversations from one unified workspace.
            </p>
          </div>

          {/* FACEBOOK */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <FacebookLogo size={28} />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900">Facebook</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Bring Facebook Messenger conversations into your unified communication workflow.
            </p>
          </div>

          {/* YOUTUBE */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <YouTubeLogo size={28} />
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" /> Connected
              </span>
            </div>
            <h4 className="text-base font-black text-slate-900">YouTube</h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Connect your YouTube presence and keep communication within your workflow.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 6. CONNECTORS SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="connectors" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            INTEGRATION CLOUD
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Connect the Tools Your Business Already Uses
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Bring your emails, documents, spreadsheets, maps, and business data into the same workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { logo: <GmailLogo size={24} />, name: 'Gmail', desc: 'Email communication' },
            { logo: <OutlookLogo size={24} />, name: 'Microsoft Outlook', desc: 'Business email' },
            { logo: <Layers size={22} className="text-emerald-600" />, name: 'Google Maps', desc: 'Location intelligence' },
            { logo: <GoogleDocsLogo size={24} />, name: 'Google Docs', desc: 'Documents & workflows' },
            { logo: <Share2 size={22} className="text-blue-500" />, name: 'OneDrive', desc: 'Cloud files' },
            { logo: <GoogleSheetsLogo size={24} />, name: 'Google Sheets', desc: 'Business data & records' },
            { logo: <FileText size={22} className="text-amber-500" />, name: 'Google Slides', desc: 'Presentations' },
            { logo: <MessageSquare size={22} className="text-cyan-600" />, name: 'Google News Feed', desc: 'News & information' },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-center gap-3.5 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                {item.logo}
              </div>
              <div className="text-left">
                <h5 className="text-xs font-black text-slate-900">{item.name}</h5>
                <p className="text-[11px] text-slate-500 font-medium">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 7. AUTOMATION MODULES SECTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-gradient-to-b from-emerald-50/50 to-white rounded-3xl border border-emerald-200/80 my-10">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
            AUTOMATION ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            From Conversation to Completion — Automatically
          </h2>
          <p className="text-sm sm:text-base text-slate-500 font-medium max-w-xl mx-auto">
            Turn everyday business activity into automated workflows.
          </p>
        </div>

        {/* Interactive Automation Chain Visual */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-5xl mx-auto">
          {[
            { label: 'CUSTOMER MESSAGE', bg: 'bg-[#25D366] text-white' },
            { label: 'CRM', bg: 'bg-[#059669] text-white' },
            { label: 'AUTO REPLY', bg: 'bg-indigo-600 text-white' },
            { label: 'QUOTATION', bg: 'bg-amber-600 text-white' },
            { label: 'PAYMENT', bg: 'bg-rose-600 text-white' },
            { label: 'INVOICE', bg: 'bg-emerald-600 text-white' },
            { label: 'COMPLETED', bg: 'bg-slate-900 text-white' }
          ].map((step, idx) => (
            <React.Fragment key={idx}>
              <div className={cn("px-4 py-2.5 rounded-xl font-black text-xs shadow-md transition-all", step.bg)}>
                {step.label}
              </div>
              {idx < 6 && <ArrowRight size={16} className="text-slate-400 shrink-0 hidden sm:inline" />}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 8. HOW UWO CONNECT WORKS */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
            SIMPLE 3-STEP WORKFLOW
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How UWO Connect Works
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-left">
            <span className="text-3xl font-black text-emerald-600">Step 01</span>
            <h3 className="text-xl font-black text-slate-900">CONNECT</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Connect your communication channels and business tools in minutes.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-left">
            <span className="text-3xl font-black text-emerald-600">Step 02</span>
            <h3 className="text-xl font-black text-slate-900">AUTOMATE</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Create intelligent workflows that handle repetitive tasks automatically.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200 space-y-4 shadow-sm text-left">
            <span className="text-3xl font-black text-emerald-600">Step 03</span>
            <h3 className="text-xl font-black text-slate-900">GROW</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Spend less time switching between tools and more time growing your business.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 9. REAL-WORLD AUTOMATION EXAMPLE */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-900 text-white rounded-3xl my-10 shadow-2xl">
        <div className="text-center space-y-3 mb-12">
          <span className="text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950 px-3 py-1 rounded-full border border-emerald-800">
            SIMULATED CUSTOMER JOURNEY
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            See Automation in Action
          </h2>
        </div>

        {/* Step-by-Step Interactive Playback */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto text-left">
          
          <div className="space-y-3">
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
                  "p-4 rounded-2xl border transition-all cursor-pointer",
                  activeWorkflowTab === i
                    ? "bg-emerald-950/80 border-emerald-500 text-white shadow-lg"
                    : "bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-white"
                )}
              >
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold">{st.title}</h5>
                  {activeWorkflowTab === i && <CheckCircle2 size={16} className="text-emerald-400" />}
                </div>
                <p className="text-[11px] text-slate-300 mt-1">{st.desc}</p>
              </div>
            ))}
          </div>

          <div className="p-6 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-bold text-emerald-400">Powered by UWO Connect Automation</span>
              <span className="text-[10px] font-mono text-slate-500">LIVE FEED</span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300 font-mono">
              <p className="text-emerald-400">✓ Customer Handled</p>
              <p className="text-emerald-400">✓ Lead Captured</p>
              <p className="text-emerald-400">✓ Quotation Created</p>
              <p className="text-emerald-400">✓ Payment Processed</p>
              <p className="text-emerald-400">✓ Invoice Generated</p>
            </div>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 10. UNIFIED WORKSPACE SECTION (CHAOS VS CONNECTED) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Stop Switching Between Tools
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* WITHOUT UWO CONNECT */}
          <div className="p-8 rounded-3xl bg-rose-50/50 border border-rose-200 text-left space-y-4">
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-black rounded-full">
              Without UWO Connect
            </span>
            <h4 className="text-lg font-black text-slate-900">Disconnected Chaos</h4>
            <p className="text-xs text-slate-600 font-medium">
              10 browser tabs, manual copy-pasting, lost leads, delayed replies, and chaotic manual invoicing.
            </p>
          </div>

          {/* WITH UWO CONNECT */}
          <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-200 text-left space-y-4">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-black rounded-full">
              With UWO Connect
            </span>
            <h4 className="text-lg font-black text-slate-900">One Clean Central Workspace</h4>
            <p className="text-xs text-slate-600 font-medium">
              Messages, Leads, Documents, Quotations, Payments, and Invoices automatically synced in real time.
            </p>
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 11. FEATURE GRID (9 MODULES) */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-slate-50/80 rounded-3xl border border-slate-200/80 my-10">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Everything You Need to Run Smarter
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {[
            { icon: <LayoutDashboard size={20} className="text-emerald-600" />, title: 'Team Dashboard', desc: 'Keep your team and business activity organized.' },
            { icon: <Users size={20} className="text-emerald-600" />, title: 'CRM', desc: 'Capture and manage customer relationships.' },
            { icon: <Bot size={20} className="text-emerald-600" />, title: 'Auto Reply', desc: 'Respond faster with intelligent automated replies.' },
            { icon: <FileCheck size={20} className="text-emerald-600" />, title: 'Quotation', desc: 'Create professional quotations faster.' },
            { icon: <Receipt size={20} className="text-emerald-600" />, title: 'Invoice', desc: 'Generate invoices as part of your workflow.' },
            { icon: <FileText size={20} className="text-emerald-600" />, title: 'Proposal', desc: 'Create and manage business proposals.' },
            { icon: <ShoppingBag size={20} className="text-emerald-600" />, title: 'Catalog', desc: 'Present products and services clearly.' },
            { icon: <CreditCard size={20} className="text-emerald-600" />, title: 'Payment', desc: 'Connect payment actions to your business workflow.' },
            { icon: <Video size={20} className="text-emerald-600" />, title: 'Voice / Video Call', desc: 'Communicate with customers through voice and video.' },
          ].map((item, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 inline-block">
                {item.icon}
              </div>
              <h5 className="text-sm font-black text-slate-900">{item.title}</h5>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 12. FINAL PRICING & CALL TO ACTION */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#059669] to-[#047857] text-white shadow-2xl space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Your Business Shouldn't Run on Manual Work.
          </h2>
          <p className="text-sm sm:text-base font-medium max-w-xl mx-auto text-emerald-100">
            Connect your channels. Automate repetitive work. Manage everything from one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={handleStartFree}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-extrabold shadow-lg transition-all cursor-pointer"
            >
              Start with UWO Connect →
            </button>
            <Link
              href="/client/plans"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-emerald-800/60 hover:bg-emerald-800 text-white text-sm font-extrabold border border-emerald-500/40 transition-all"
            >
              View Official Plans
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* 13. FOOTER */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <footer className="bg-slate-50 border-t border-slate-200 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8 text-left text-xs">
          
          <div className="col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#059669] text-white flex items-center justify-center">
                <Zap size={18} className="fill-white" />
              </div>
              <span className="text-base font-black text-slate-900 tracking-tight">UWO Connect</span>
            </div>
            <p className="text-slate-500 font-medium max-w-sm">
              Unified Communication & Business Automation Platform. Connect channels, tools, and workflows seamlessly.
            </p>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-slate-900">Product</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><a href="#channels" className="hover:text-emerald-600">Channels</a></li>
              <li><a href="#connectors" className="hover:text-emerald-600">Connectors</a></li>
              <li><a href="#features" className="hover:text-emerald-600">Features</a></li>
              <li><Link href="/client/plans" className="hover:text-emerald-600">Pricing</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-slate-900">Company</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><Link href="/about" className="hover:text-emerald-600">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-emerald-600">Contact</Link></li>
              <li><Link href="/book" className="hover:text-emerald-600">Book Demo</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h5 className="font-extrabold uppercase tracking-wider text-slate-900">Legal</h5>
            <ul className="space-y-2 text-slate-600 font-medium">
              <li><Link href="/privacy" className="hover:text-emerald-600">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-emerald-600">Terms of Service</Link></li>
              <li><Link href="/refund-policy" className="hover:text-emerald-600">Refund Policy</Link></li>
            </ul>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-10 mt-10 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
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

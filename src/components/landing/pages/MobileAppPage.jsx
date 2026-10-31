'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Smartphone, Zap, Bot, ShieldCheck, Activity, CheckCircle2,
  ArrowRight, Star, Bell, Sparkles, Lock, Layers, MessageSquare,
  Users, QrCode, FileText, Workflow, ChevronDown, ChevronUp,
  Check, SlidersHorizontal, ArrowUpRight, Send, Globe, Radio,
  Play, Pause, RotateCcw, Volume2, CheckCheck, Paperclip,
  Phone, Search, ChevronLeft, Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import {
  WhatsAppLogo, InstagramLogo, FacebookLogo,
  GooglePlayLogo, AppleLogo
} from '../LandingBrandLogos';

export default function MobileAppPage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState(null);

  // Video-like Auto Simulation States
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const PLAY_STORE_URL = "https://play.google.com/store/apps/details?id=com.uwo.uwoconnect&hl=en_IN";

  // Auto-playing video simulation timer (4 scenes, 4 seconds each = 16 seconds loop)
  useEffect(() => {
    if (!isPlayingDemo) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setCurrentScene((prevScene) => (prevScene + 1) % 4);
          return 0;
        }
        return prev + 2.5; // updates every 100ms -> 4s per scene
      });
    }, 100);

    return () => clearInterval(interval);
  }, [isPlayingDemo]);

  const scenes = [
    {
      id: 0,
      title: 'Push Alert',
      label: '1. Inbound Alert',
      icon: Bell,
      timeCode: '0:02',
      tagline: 'Instant WhatsApp lead notification pops down',
    },
    {
      id: 1,
      title: 'Live Chat',
      label: '2. Live Chat',
      icon: MessageSquare,
      timeCode: '0:06',
      tagline: 'Real-time multi-agent chat interface with typing wave',
    },
    {
      id: 2,
      title: 'AI Proposal',
      label: '3. AI Proposal',
      icon: Sparkles,
      timeCode: '0:10',
      tagline: 'Abha AI generates PDF quote with GST automatically',
    },
    {
      id: 3,
      title: 'Deal Won',
      label: '4. Closed Won',
      icon: CheckCircle2,
      timeCode: '0:14',
      tagline: 'UPI payment verified & official GST invoice generated',
    }
  ];

  const handleSelectScene = (idx) => {
    setCurrentScene(idx);
    setProgress(0);
  };

  const coreFeatures = [
    {
      icon: <Zap className="w-5 h-5 text-[#0B8F78]" />,
      title: 'Zero-Latency Push Notifications',
      description: 'Receive instant alerts on your phone the millisecond a WhatsApp message or Meta ad lead arrives. Never lose a deal to slow replies.'
    },
    {
      icon: <Bot className="w-5 h-5 text-[#0B8F78]" />,
      title: '1-Tap AI Quick Replies',
      description: 'Let Abha AI compose brand-aligned responses, product recommendations, or price quotes in one tap directly from your notification panel.'
    },
    {
      icon: <Users className="w-5 h-5 text-[#0B8F78]" />,
      title: 'Team Routing & Private Notes',
      description: 'Reassign incoming chats to active team members and drop internal private notes that are completely invisible to the customer.'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#0B8F78]" />,
      title: 'Biometric Security & Encryption',
      description: 'Protect confidential customer chats and leads with fingerprint/FaceID biometrics, SSL/TLS transport, and encrypted local storage.'
    },
    {
      icon: <FileText className="w-5 h-5 text-[#0B8F78]" />,
      title: 'Instant GST Quotation Dispatch',
      description: 'Generate GST-compliant estimate PDFs and dispatch them right into the client’s WhatsApp chat in less than 30 seconds.'
    },
    {
      icon: <Activity className="w-5 h-5 text-[#0B8F78]" />,
      title: 'Real-Time Pipeline Analytics',
      description: 'Track daily conversation volume, average resolution times, and agent performance live on mobile dashboards.'
    }
  ];

  const faqs = [
    {
      q: 'Is the UWO Connect mobile app free to download?',
      a: 'Yes, the mobile app is completely free to download from the Google Play Store for all active UWO Connect workspace members and administrators.'
    },
    {
      q: 'Can my entire support and sales team use the mobile app?',
      a: 'Yes, unlimited agents can log in from their respective mobile devices. Role-based permissions defined on the web console automatically apply on mobile.'
    },
    {
      q: 'When will the iOS version be released?',
      a: 'The iOS version is currently in Apple TestFlight final testing and review. It will be released publicly on the Apple App Store very soon.'
    },
    {
      q: 'Does the mobile app support WhatsApp media, audio, and documents?',
      a: 'Yes, you can send and receive photos, videos, PDF documents, voice notes, and location pins directly within the mobile inbox.'
    },
    {
      q: 'Will push notifications wake my phone for high-priority leads?',
      a: 'Yes, you can configure granular notification channels on Android so high-priority inquiries alert you with sound and banner previews.'
    }
  ];

  return (
    <LandingLayout activePage="mobile-app">
      {({ isDarkMode }) => (
        <div className="flex flex-col w-full">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: FULL-SCREEN IMMERSIVE HERO WITH LIVE DEMO    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className={cn(
            "w-full min-h-[calc(100vh-4rem)] flex items-center justify-center relative overflow-hidden px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-10 lg:py-12 border-b transition-colors duration-300",
            isDarkMode
              ? "bg-gradient-to-b from-[#070B14] via-[#0B1220] to-[#070B14] border-slate-800/80"
              : "bg-gradient-to-b from-white via-emerald-50/25 to-[#F8FAFC] border-slate-200/80"
          )}>

            {/* Subtle Tech Pattern Background */}
            <div
              className="absolute inset-0 opacity-[0.035] dark:opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #0B8F78 1.2px, transparent 1.2px)',
                backgroundSize: '36px 36px'
              }}
            />

            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#0B8F78]/15 via-teal-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-bl from-teal-500/15 via-blue-500/10 to-transparent rounded-full blur-[140px] pointer-events-none" />

            <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 xl:gap-16 items-center relative z-10">

              {/* Left Column: Heading, Subtitle & Download CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-7 xl:col-span-7 space-y-6 sm:space-y-7 text-left"
              >
                {/* Live Badge */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#0B8F78]/30 bg-[#0B8F78]/10 backdrop-blur-md">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#0B8F78] animate-pulse shadow-sm shadow-[#0B8F78]/80" />
                  <span className="text-xs font-bold text-[#0B8F78] tracking-wide uppercase">
                    Android App Live on Google Play &bull; v2.4.0
                  </span>
                </div>

                {/* Big Bold Headline with Dark Green Accent */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[62px] font-black tracking-tight leading-[1.08] text-slate-900 dark:text-white">
                  Work From Anywhere.{' '}
                  <span className="text-[#0B8F78]">
                    Close Deals Everywhere.
                  </span>
                </h1>

                {/* Subtitle */}
                <p className="text-base sm:text-lg lg:text-xl text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
                  Put the full power of UWO Connect in your pocket. Respond to WhatsApp chats, qualify Meta leads, trigger AI replies, and approve customer proposals on the move.
                </p>

                {/* Download CTA Group */}
                <div className="space-y-4 pt-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Download Official App
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Google Play Store Button (Active Link with Pristine Contrast) */}
                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3.5 px-6 py-4 rounded-2xl bg-slate-950 text-white hover:bg-slate-900 active:scale-95 transition-all shadow-xl hover:shadow-emerald-500/25 border border-slate-800 cursor-pointer"
                    >
                      <GooglePlayLogo size={28} />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] font-semibold tracking-wider uppercase block text-slate-400 group-hover:text-slate-300 transition-colors">
                          Get it on
                        </span>
                        <span className="text-base font-extrabold tracking-tight text-white">
                          Google Play
                        </span>
                      </div>
                      <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#0B8F78] text-white shadow-xs">
                        <Check size={11} strokeWidth={3} />
                        Live Now
                      </span>
                    </a>

                    {/* Apple App Store Button (Coming Soon) */}
                    <div
                      className={cn(
                        "relative inline-flex items-center gap-3.5 px-6 py-4 rounded-2xl border-2 border-dashed select-none cursor-not-allowed transition-all",
                        isDarkMode
                          ? "border-slate-700 bg-slate-900/60 text-slate-400"
                          : "border-slate-300 bg-slate-100/80 text-slate-600"
                      )}
                      title="iOS App is currently under review by Apple and launching soon on the App Store."
                    >
                      <AppleLogo size={26} className="opacity-80" />
                      <div className="text-left leading-tight">
                        <span className="text-[10px] font-semibold tracking-wider uppercase block opacity-75">
                          Download on the
                        </span>
                        <span className="text-base font-extrabold tracking-tight opacity-90">
                          App Store
                        </span>
                      </div>
                      <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wide uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                        Coming Soon
                      </span>
                    </div>
                  </div>

                  {/* Trust Specs */}
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Star size={14} className="fill-amber-400 text-amber-400" />
                      <strong className="text-slate-800 dark:text-slate-200">4.9/5 Rating</strong> on Play Store
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 size={14} className="text-[#0B8F78] shrink-0" />
                      Android 8.0 &amp; Above
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-blue-500 shrink-0" />
                      Enterprise SSL Encrypted
                    </span>
                  </div>
                </div>

                {/* Quick QR Code Card for Desktop Visitors */}
                <div className={cn(
                  "p-4 rounded-2xl border flex items-center gap-4 max-w-md transition-all",
                  isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                )}>
                  <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-[#0B8F78] flex items-center justify-center shrink-0 border border-[#0B8F78]/20">
                    <QrCode size={24} />
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-slate-900 dark:text-white block">
                      Browsing on Desktop?
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 block mt-0.5">
                      Scan the QR code or search &ldquo;<strong>UWO Connect</strong>&rdquo; on Google Play to install directly on your phone.
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Right Column: High Fidelity LIGHT THEME Phone Chassis with Video/Live Recording Mode */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 25 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="lg:col-span-5 xl:col-span-5 relative flex flex-col items-center justify-center w-full"
              >
                <div className="relative mx-auto w-full max-w-[340px] xl:max-w-[360px]">

                  {/* Ambient Pulsing Glow behind chassis */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#0B8F78]/25 via-teal-500/20 to-blue-500/20 rounded-[56px] blur-2xl transform scale-95 pointer-events-none" />

                  {/* Phone Chassis Outer Frame (Space Black / Titanium Metallic Border) */}
                  <div className="relative rounded-[46px] p-2.5 sm:p-3 bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-[3.5px] border-slate-700/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.45)]">

                    {/* Phone Screen Display — 100% LIGHT THEME CANVAS (Fits within screen gracefully) */}
                    <div className="relative rounded-[36px] overflow-hidden bg-slate-50 text-slate-900 h-[600px] sm:h-[620px] xl:h-[650px] flex flex-col justify-between border border-slate-200/90 shadow-inner">

                      {/* 1. iOS STATUS BAR WITH REALISTIC DYNAMIC ISLAND */}
                      <div className="pt-3 pb-1.5 px-6 bg-white flex items-center justify-between text-[11px] font-bold text-slate-900 select-none z-20 border-b border-slate-100">
                        <span className="font-semibold tracking-tight">9:41</span>
                        
                        {/* Dynamic Island */}
                        <div className="w-24 h-5.5 bg-black rounded-full flex items-center justify-between px-2.5 shadow-xs">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          <div className="flex items-center gap-1">
                            <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-700">5G</span>
                          <div className="w-4.5 h-2.5 border border-slate-700 rounded-[3px] p-0.5 flex items-center">
                            <div className="w-full h-full bg-[#0B8F78] rounded-[1px]" />
                          </div>
                        </div>
                      </div>

                      {/* 2. CONTEXTUAL IN-APP HEADER (Adaptive by Scene) */}
                      {currentScene === 1 ? (
                        /* WhatsApp / Chat Screen Header */
                        <div className="px-3.5 py-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectScene(0)}
                              className="text-slate-600 hover:text-slate-900 -ml-1 cursor-pointer"
                            >
                              <ChevronLeft size={18} />
                            </button>
                            <div className="relative">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#0B8F78] to-teal-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                RM
                              </div>
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white absolute bottom-0 right-0" />
                            </div>
                            <div className="text-left leading-tight">
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-slate-900">Rahul Mehta</span>
                                <WhatsAppLogo size={12} />
                              </div>
                              <span className="text-[10px] text-emerald-600 font-semibold">Online &bull; TechCorp</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-bold text-[#0B8F78] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                              ₹1.5L Deal
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* UWO Connect Standard App Bar */
                        <div className="px-4 py-2.5 bg-white border-b border-slate-200/90 flex items-center justify-between shadow-xs">
                          <div className="flex items-center gap-2">
                            <img
                              src="/favicon.png"
                              alt="UWO Connect"
                              className="w-6 h-6 object-contain"
                            />
                            <div className="text-left">
                              <div className="text-xs font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                                <span>UWO Connect</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                              </div>
                              <span className="text-[10px] text-slate-500 block -mt-0.5">
                                {scenes[currentScene].title} &bull; Live Mobile CRM
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-[#0B8F78] border border-emerald-200 text-[10px] font-bold">
                              Live
                            </span>
                            <div className="w-7 h-7 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 relative">
                              <Bell size={13} />
                              <span className="w-2 h-2 rounded-full bg-[#0B8F78] absolute top-1 right-1" />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* 3. DYNAMIC SCENE SIMULATION CANVAS (TALLER WITH AMPLE BREATHING ROOM) */}
                      <div className="p-3.5 bg-slate-100/70 flex-1 min-h-0 flex flex-col justify-between overflow-y-auto no-scrollbar [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <AnimatePresence mode="wait">

                          {/* SCENE 0: INCOMING PUSH ALERT & ACTIVE INBOX */}
                          {currentScene === 0 && (
                            <motion.div
                              key="scene-0"
                              initial={{ opacity: 0, y: -20 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 text-left"
                            >
                              {/* Search & Filter Bar */}
                              <div className="flex items-center gap-1.5 p-2 rounded-xl bg-white border border-slate-200 text-slate-400 text-xs shadow-2xs">
                                <Search size={13} className="text-slate-400 ml-1" />
                                <span className="text-[11px] text-slate-400">Search 240 leads, tags...</span>
                              </div>

                              {/* Filter Chips */}
                              <div className="flex items-center gap-1.5 text-[10px] font-bold">
                                <span className="px-2.5 py-1 rounded-lg bg-[#0B8F78] text-white shadow-2xs">All (12)</span>
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600">Unassigned (3)</span>
                                <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-600">High Intent</span>
                              </div>

                              {/* Animated Dropping Push Notification Alert */}
                              <div className="p-3 rounded-2xl bg-white border-2 border-emerald-500/60 shadow-lg shadow-emerald-700/10 space-y-2">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center shadow-xs">
                                      <WhatsAppLogo size={13} />
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-900 block leading-tight">
                                        WhatsApp Business
                                      </span>
                                      <span className="text-[9px] text-slate-400">Inbound High Intent Lead</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-[#0B8F78] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                    Just Now
                                  </span>
                                </div>
                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                                  <span className="text-xs font-black text-slate-900 block">Rahul Mehta &bull; TechCorp India</span>
                                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">
                                    &ldquo;Can you please share quotation for 20 agent seats with GST calculation?&rdquo;
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 pt-0.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectScene(1)}
                                    className="flex-1 py-1.5 rounded-lg bg-[#0B8F78] text-white text-[10px] font-bold shadow-xs text-center cursor-pointer"
                                  >
                                    Open Chat
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleSelectScene(2)}
                                    className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-bold text-center cursor-pointer"
                                  >
                                    Generate Quote
                                  </button>
                                </div>
                              </div>

                              {/* Recent Active Conversations List */}
                              <div className="space-y-2 pt-1">
                                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
                                  Active Threads
                                </div>
                                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center">
                                      PS
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">Pooja Sharma (Meta Lead)</span>
                                      <span className="text-[9px] text-slate-500">Payment receipt uploaded &bull; 4m ago</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-emerald-600">₹85,000</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 font-bold text-[10px] flex items-center justify-center">
                                      VL
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">Vikram Logistics</span>
                                      <span className="text-[9px] text-slate-500">Proposal under review &bull; 18m ago</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500">₹2.4L</span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between shadow-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] flex items-center justify-center">
                                      AP
                                    </div>
                                    <div>
                                      <span className="text-[11px] font-bold text-slate-800 block leading-tight">Dr. Amit Patel</span>
                                      <span className="text-[9px] text-slate-500">Requested live demo &bull; 35m ago</span>
                                    </div>
                                  </div>
                                  <span className="text-[9px] font-bold text-slate-500">₹1.2L</span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* SCENE 1: REALISTIC WHATSAPP CRM CONVERSATION WITH INLINE AI PROPOSAL */}
                          {currentScene === 1 && (
                            <motion.div
                              key="scene-1"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ duration: 0.3 }}
                              className="flex flex-col justify-between h-full space-y-2 text-left"
                            >
                              <div className="space-y-2.5">
                                {/* Lead Context Pill */}
                                <div className="text-center">
                                  <span className="text-[9px] font-bold bg-white text-slate-500 px-2.5 py-0.5 rounded-full border border-slate-200 shadow-2xs">
                                    Today, 9:41 AM &bull; WhatsApp API Inbound
                                  </span>
                                </div>

                                {/* Customer Message Bubble */}
                                <div className="max-w-[88%] p-2.5 rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 shadow-xs space-y-1">
                                  <p className="text-[11px] text-slate-800 leading-snug">
                                    Can you please share quotation for 20 agent seats with GST calculation?
                                  </p>
                                  <span className="text-[8px] text-slate-400 block text-right">9:41 AM</span>
                                </div>

                                {/* Agent Reply Bubble */}
                                <div className="ml-auto max-w-[88%] p-2.5 rounded-2xl rounded-tr-xs bg-[#0B8F78] text-white shadow-sm space-y-1">
                                  <p className="text-[11px] leading-snug font-medium">
                                    Sure Rahul! Generating your customized commercial estimate with Abha AI now.
                                  </p>
                                  <div className="flex items-center justify-end gap-1 text-[8px] text-emerald-100">
                                    <span>9:41 AM</span>
                                    <CheckCheck size={11} className="text-emerald-200" />
                                  </div>
                                </div>

                                {/* Abha AI Inline Proposal Card */}
                                <div className="p-3 rounded-2xl bg-white border-2 border-[#0B8F78] shadow-sm space-y-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1.5 text-[#0B8F78] font-black text-[11px]">
                                      <Sparkles size={13} />
                                      <span>Abha AI Smart Proposal Ready</span>
                                    </div>
                                    <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-[#0B8F78]">
                                      GST Ready
                                    </span>
                                  </div>

                                  <div className="p-2 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-0.5">
                                    <div className="flex justify-between items-center text-[11px] font-bold text-slate-900">
                                      <span>Enterprise (20 Seats)</span>
                                      <span className="text-[#0B8F78]">₹14,999/mo</span>
                                    </div>
                                    <p className="text-[9px] text-slate-600">
                                      Includes 18% GST (HSN: 998314) &bull; Unlimited WhatsApp Flows
                                    </p>
                                  </div>

                                  {/* PDF Attachment Item */}
                                  <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                                    <div className="flex items-center gap-1.5">
                                      <div className="w-6 h-6 rounded bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-[9px]">
                                        PDF
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-bold text-slate-800 block leading-tight">
                                          Quote_TechCorp_v1.pdf
                                        </span>
                                        <span className="text-[8px] text-slate-400">142 KB</span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleSelectScene(2)}
                                      className="text-[9px] text-[#0B8F78] font-bold hover:underline cursor-pointer"
                                    >
                                      Review
                                    </button>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleSelectScene(3)}
                                    className="w-full py-1.5 rounded-xl bg-[#0B8F78] text-white text-[10px] font-bold text-center shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Send size={11} />
                                    <span>Dispatch on WhatsApp</span>
                                  </button>
                                </div>

                                {/* Customer Reaction Reply Bubble */}
                                <div className="max-w-[85%] p-2 rounded-2xl rounded-tl-xs bg-white border border-slate-200/90 shadow-xs space-y-0.5">
                                  <p className="text-[10px] text-slate-800 leading-snug">
                                    Looks great! Please dispatch the payment link.
                                  </p>
                                  <span className="text-[8px] text-slate-400 block text-right">9:42 AM</span>
                                </div>
                              </div>

                              {/* Chat Input Bar Footer */}
                              <div className="pt-2">
                                <div className="p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center gap-2">
                                  <Paperclip size={14} className="text-slate-400 ml-1" />
                                  <span className="text-[10px] text-slate-400 flex-1 truncate">
                                    Reply with Abha AI Copilot...
                                  </span>
                                  <div className="w-6 h-6 rounded-xl bg-[#0B8F78] text-white flex items-center justify-center shadow-xs">
                                    <Send size={11} />
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* SCENE 2: INTERACTIVE AI PROPOSAL & GST BREAKDOWN */}
                          {currentScene === 2 && (
                            <motion.div
                              key="scene-2"
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 text-left"
                            >
                              {/* Proposal Sheet Card */}
                              <div className="p-3.5 rounded-2xl bg-white border-2 border-[#0B8F78] shadow-md space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 text-[#0B8F78] font-black text-xs">
                                    <Sparkles size={14} />
                                    <span>Abha AI Commercial Proposal</span>
                                  </div>
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#0B8F78]">
                                    Auto Calculated
                                  </span>
                                </div>

                                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[10px] space-y-1">
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Account:</span>
                                    <span className="font-bold text-slate-800">TechCorp India Pvt Ltd</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-slate-500">Contact:</span>
                                    <span className="font-bold text-slate-800">Rahul Mehta (VP Sales)</span>
                                  </div>
                                </div>

                                {/* Pricing Breakdown Table */}
                                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 space-y-2 text-[10px]">
                                  <div className="flex justify-between text-slate-700">
                                    <span>Enterprise Tier (20 Seats):</span>
                                    <span className="font-semibold">₹12,711</span>
                                  </div>
                                  <div className="flex justify-between text-slate-700">
                                    <span>18% GST (HSN: 998314):</span>
                                    <span className="font-semibold">₹2,288</span>
                                  </div>
                                  <div className="border-t border-emerald-200 pt-1.5 flex justify-between font-black text-xs text-slate-900">
                                    <span>Total Payable:</span>
                                    <span className="text-[#0B8F78]">₹14,999/mo</span>
                                  </div>
                                </div>

                                {/* Included Features */}
                                <div className="space-y-1.5 text-[9px] text-slate-600">
                                  <div className="flex items-center gap-1">
                                    <Check size={11} className="text-[#0B8F78]" />
                                    <span>Official Meta WhatsApp Green Tick Assistance</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Check size={11} className="text-[#0B8F78]" />
                                    <span>Unlimited Automated Flows &amp; AI Agents</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Check size={11} className="text-[#0B8F78]" />
                                    <span>Instant PDF Dispatch via WhatsApp API</span>
                                  </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleSelectScene(3)}
                                    className="w-full py-2.5 rounded-xl bg-[#0B8F78] text-white text-[11px] font-bold text-center shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                  >
                                    <Send size={12} />
                                    <span>Dispatch via WhatsApp API</span>
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* SCENE 3: DEAL WON & OFFICIAL TAX INVOICE */}
                          {currentScene === 3 && (
                            <motion.div
                              key="scene-3"
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -15 }}
                              transition={{ duration: 0.3 }}
                              className="space-y-3 text-left"
                            >
                              {/* Celebration Banner */}
                              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-[#0B8F78] to-teal-700 text-white shadow-lg space-y-1">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs font-black tracking-wide flex items-center gap-1">
                                    🎉 Deal Closed Won!
                                  </span>
                                  <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-white/20">
                                    SLA: 1m 24s
                                  </span>
                                </div>
                                <p className="text-[10px] text-emerald-50 leading-snug">
                                  Rahul Mehta accepted proposal &amp; completed UPI payment verification.
                                </p>
                              </div>

                              {/* Official GST Tax Invoice Card */}
                              <div className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-2.5">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <span className="text-xs font-bold text-slate-900 block">
                                      Tax Invoice #INV-2026-904
                                    </span>
                                    <span className="text-[9px] text-slate-400">Date: Today, 9:43 AM</span>
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-[#0B8F78]">
                                    Paid ₹14,999
                                  </span>
                                </div>

                                <div className="text-[10px] text-slate-500 space-y-1.5 border-t border-slate-100 pt-2">
                                  <div className="flex justify-between">
                                    <span>Client:</span>
                                    <strong className="text-slate-700">TechCorp India Pvt Ltd</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>GSTIN:</span>
                                    <strong className="text-slate-700">07AAAAA0000A1Z5</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Payment Mode:</span>
                                    <strong className="text-slate-700">Razorpay UPI (Ref #98210)</strong>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Status:</span>
                                    <strong className="text-emerald-600">WhatsApp Onboarding Triggered</strong>
                                  </div>
                                </div>

                                <div className="pt-1.5 flex items-center gap-2">
                                  <span className="flex-1 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center gap-1">
                                    <Download size={11} />
                                    <span>Invoice PDF</span>
                                  </span>
                                  <span className="flex-1 py-1.5 rounded-lg bg-emerald-50 text-[#0B8F78] border border-emerald-200 text-[10px] font-bold flex items-center justify-center gap-1">
                                    <CheckCircle2 size={11} />
                                    <span>CRM Updated</span>
                                  </span>
                                </div>
                              </div>
                            </motion.div>
                          )}

                        </AnimatePresence>
                      </div>

                      {/* 4. LIGHT APP BOTTOM TABS */}
                      <div className="px-5 py-2.5 bg-white border-t border-slate-200/80 flex items-center justify-between text-slate-400 text-[10px] select-none">
                        <button
                          type="button"
                          onClick={() => handleSelectScene(0)}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer", currentScene === 0 ? "text-[#0B8F78] font-bold" : "")}
                        >
                          <MessageSquare size={14} />
                          <span>Inbox</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectScene(1)}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer", currentScene === 1 ? "text-[#0B8F78] font-bold" : "")}
                        >
                          <Bot size={14} />
                          <span>Copilot</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectScene(2)}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer", currentScene === 2 ? "text-[#0B8F78] font-bold" : "")}
                        >
                          <FileText size={14} />
                          <span>Proposals</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSelectScene(3)}
                          className={cn("flex flex-col items-center gap-0.5 cursor-pointer", currentScene === 3 ? "text-[#0B8F78] font-bold" : "")}
                        >
                          <CheckCircle2 size={14} />
                          <span>Deals</span>
                        </button>
                      </div>

                      {/* iOS Home Indicator Bar */}
                      <div className="py-2 bg-white flex justify-center border-t border-slate-50">
                        <div className="w-24 h-1 bg-slate-300 rounded-full" />
                      </div>

                    </div>
                  </div>

                </div>
              </motion.div>

            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SUBSEQUENT SECTIONS                                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div className="flex flex-col gap-24 sm:gap-32 lg:gap-40 py-20 sm:py-28">

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 2. 6 CORE NATIVE MOBILE CAPABILITIES (2x3 GRID)               */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B8F78]">
                Native Performance
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Engineered For High-Speed Teams
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                Built with reactive WebSockets and native push channels so you never miss an opportunity.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreFeatures.map((feat, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 hover:border-[#0B8F78]/50 space-y-3 text-left",
                    isDarkMode
                      ? "bg-slate-900/60 border-slate-800/80 hover:bg-slate-900/90"
                      : "bg-white border-slate-200/90 hover:shadow-lg hover:shadow-emerald-500/5"
                  )}
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                    {feat.icon}
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. 3-STEP QUICK ONBOARDING WALKTHROUGH                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className={cn(
              "p-8 sm:p-12 lg:p-16 rounded-[40px] border relative overflow-hidden",
              isDarkMode
                ? "bg-gradient-to-br from-slate-900 via-[#0B1222] to-slate-900 border-slate-800"
                : "bg-gradient-to-br from-white via-emerald-50/20 to-slate-50 border-slate-200 shadow-md"
            )}>
              <div className="max-w-3xl mx-auto text-center space-y-4 mb-12">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0B8F78]">
                  Simple Setup
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Get Started in 3 Simple Steps
                </h2>
                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
                  You can be up and running on mobile in under 60 seconds.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0B8F78] text-white font-black flex items-center justify-center text-sm shadow-md shadow-emerald-500/30">
                    1
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Download from Play Store
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Install the official UWO Connect app from the Google Play Store on your Android smartphone.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white font-black flex items-center justify-center text-sm shadow-md shadow-teal-500/30">
                    2
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Log In with Workspace ID
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Sign in using your workspace email, Google SSO, or scan the quick login QR from your desktop dashboard.
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500 text-white font-black flex items-center justify-center text-sm shadow-md shadow-blue-500/30">
                    3
                  </div>
                  <h4 className="text-base font-bold text-slate-900 dark:text-white">
                    Enable Push &amp; Start Closing
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Turn on notifications, accept customer chats, and let AI automations handle inquiries on the fly.
                  </p>
                </div>
              </div>

              <div className="pt-10 text-center">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white font-bold text-sm shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  <GooglePlayLogo size={20} />
                  <span>Download Free on Google Play</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 4. FREQUENTLY ASKED QUESTIONS ACCORDION                       */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8 text-left">
            <div className="text-center space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0B8F78]">
                Common Questions
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "rounded-2xl border transition-all overflow-hidden",
                    isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-xs"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-left font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-6 pb-4 text-xs sm:text-sm text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-3 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 5. BOTTOM CALL TO ACTION BANNER                               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
            <div className={cn(
              "py-16 sm:py-20 px-6 sm:px-12 rounded-[40px] text-center space-y-8 relative overflow-hidden",
              isDarkMode
                ? "bg-gradient-to-r from-emerald-950 via-[#0B1528] to-slate-950 border border-emerald-500/30"
                : "bg-gradient-to-r from-emerald-700 via-[#0B8F78] to-[#0F766E] text-white shadow-2xl"
            )}>
              <div className="max-w-2xl mx-auto space-y-4">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
                  Take Your Workspace Everywhere.
                </h2>
                <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
                  Join hundreds of forward-thinking businesses managing WhatsApp, Instagram, and Meta leads straight from their smartphones.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a
                  href={PLAY_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-xl bg-slate-950 text-white hover:bg-slate-900 border border-slate-800 font-extrabold text-sm shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <GooglePlayLogo size={24} />
                  <span>Download on Google Play</span>
                  <ArrowRight size={16} />
                </a>
                <a
                  href="/auth/register"
                  className="px-8 py-4 rounded-xl bg-white font-extrabold text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
                  style={{ color: '#0f172a' }}
                >
                  Start Free on Web
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </section>

          </div>
        </div>
      )}
    </LandingLayout>
  );
}

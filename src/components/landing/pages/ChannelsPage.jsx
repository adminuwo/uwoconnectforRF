'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MessageSquare, ArrowRight, Sparkles, CheckCircle2, Zap,
  Send, Layers, ArrowUpRight, ShieldCheck, Newspaper
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import {
  WhatsAppLogo, InstagramLogo, FacebookLogo, YouTubeLogo, GoogleNewsLogo
} from '../LandingBrandLogos';
import LiveUnifiedInboxWorkflow from '../channels/LiveUnifiedInboxWorkflow';
import { motion } from 'framer-motion';

export default function ChannelsPage() {
  const router = useRouter();
  const [activeChannel, setActiveChannel] = useState('whatsapp');

  const channelsList = [
    {
      id: 'whatsapp',
      name: 'WhatsApp Business API',
      status: 'AVAILABLE NOW',
      isAvailable: true,
      logo: <WhatsAppLogo size={36} />,
      color: '#25D366',
      activeStyle: 'bg-[#25D366] text-white border-[#25D366] shadow-lg shadow-emerald-500/30 scale-105',
      lightBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30',
      tagline: '98% open rates • Green Tick ready • 0.2s auto-replies',
      sampleSender: 'Rohan Sharma (+91 98200-XXXX)',
      sampleMsg: '“Hi! Can you share the pricing catalog for enterprise CRM?”',
      sampleReply: '“Hello Rohan! Here is the latest 2026 catalog and GST quotation PDF.”',
      screenshot: '/dashboard/dashboard_messages_live.png',
    },
    {
      id: 'instagram',
      name: 'Instagram DMs & Comments',
      status: 'AVAILABLE NOW',
      isAvailable: true,
      logo: <InstagramLogo size={36} />,
      color: '#E4405F',
      activeStyle: 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#F77737] text-white border-pink-500 shadow-lg shadow-pink-500/30 scale-105',
      lightBg: 'bg-pink-50/80 dark:bg-pink-950/40',
      border: 'border-pink-500/30',
      badge: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/30',
      tagline: 'Reel comments → instant DMs • Story mention lead capture',
      sampleSender: '@priya_designstudio',
      sampleMsg: '“Loved your latest automation reel! Can you send the pricing link?”',
      sampleReply: '“Hey Priya! Sent you the instant access link with our special 15% discount.”',
      screenshot: '/dashboard/dashboard_instagram_live.png',
    },
    {
      id: 'facebook',
      name: 'Facebook Messenger & Lead Ads',
      status: 'AVAILABLE NOW',
      isAvailable: true,
      logo: <FacebookLogo size={36} />,
      color: '#1877F2',
      activeStyle: 'bg-[#1877F2] text-white border-[#1877F2] shadow-lg shadow-blue-500/30 scale-105',
      lightBg: 'bg-blue-50/80 dark:bg-blue-950/40',
      border: 'border-blue-500/30',
      badge: 'bg-emerald-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
      tagline: 'Instant Meta Lead Ad sync • Multi-admin Messenger inbox',
      sampleSender: 'Amit Patel (Facebook Ad Lead)',
      sampleMsg: '“Submitted inquiry form regarding multi-agent team inbox.”',
      sampleReply: '“Welcome Amit! Lead assigned to Agent Sarah. Quotation dispatched.”',
      screenshot: '/dashboard/dashboard_facebook_live.png',
    },
    {
      id: 'youtube',
      name: 'YouTube Comments & Community',
      status: 'COMING SOON',
      isAvailable: false,
      logo: <YouTubeLogo size={36} />,
      color: '#FF0000',
      activeStyle: 'bg-[#FF0000] text-white border-[#FF0000] shadow-lg shadow-red-500/30 scale-105',
      lightBg: 'bg-red-50/80 dark:bg-red-950/40',
      border: 'border-red-500/30',
      badge: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      tagline: 'Video comment AI monitoring • Channel subscriber CRM routing',
      sampleSender: 'TechReviews Subscriber',
      sampleMsg: '“Which payment gateways are supported for UPI recurring invoices?”',
      sampleReply: '“Razorpay, Cashfree & UPI QR codes are supported natively!”',
      screenshot: '/dashboard/dashboard_analytics.png',
    }
  ];

  const activeData = channelsList.find(c => c.id === activeChannel) || channelsList[0];

  return (
    <LandingLayout activePage="channels">
      {({ isDarkMode }) => (
        <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48 py-16 sm:py-24 lg:py-32 overflow-hidden">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: DEV & CHANNELS ECOSYSTEM                     */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 pb-12 sm:pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Signature Heading */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-5 space-y-6 text-left"
              >
                {/* Top Pill Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                    Dev • Communication Channels
                  </span>
                </div>

                {/* Main Headline Format */}
                <div className="space-y-4">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]">
                    <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>All Your Channels. </span>
                    <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                      One Unified Place.
                    </span>
                  </h1>

                  <p className={cn(
                    "text-base sm:text-lg font-normal leading-relaxed",
                    isDarkMode ? "text-slate-300" : "text-slate-600"
                  )}>
                    Dev orchestrates incoming messages across WhatsApp, Instagram, Facebook, and YouTube straight into your team inbox.
                  </p>
                </div>

                {/* Quick Channel Pills */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs text-xs font-bold transition-colors", isDarkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200")}>
                    <WhatsAppLogo size={18} />
                    <span>WhatsApp</span>
                  </div>
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs text-xs font-bold transition-colors", isDarkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200")}>
                    <InstagramLogo size={18} />
                    <span>Instagram</span>
                  </div>
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs text-xs font-bold transition-colors", isDarkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200")}>
                    <FacebookLogo size={18} />
                    <span>Facebook</span>
                  </div>
                  <div className={cn("flex items-center gap-2 px-3 py-1.5 rounded-xl border shadow-xs text-xs font-bold opacity-80 transition-colors", isDarkMode ? "bg-slate-900 text-slate-100 border-slate-800" : "bg-white text-slate-800 border-slate-200")}>
                    <YouTubeLogo size={18} />
                    <span>YouTube</span>
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded-full bg-red-500/10 text-red-500 font-extrabold border border-red-500/20">COMING SOON</span>
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/register')}
                    className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-sm font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Connect Your Channels</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>

              {/* Right Column: Dev + Connected Orbital Channels */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-7 relative flex items-center justify-center min-h-[440px] sm:min-h-[500px]"
              >
                {/* Background Radiant Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-blue-500/10 to-transparent rounded-3xl blur-3xl" />

                {/* Central Dev Character Graphic */}
                <div className="relative z-10 flex flex-col items-center">
                  <div className="relative group">
                    <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-emerald-500 to-blue-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                    <img
                      src="/Dev_transparent.png"
                      alt="Dev - Channel Integration Specialist"
                      className="w-56 sm:w-64 md:w-72 h-auto object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Orbital Channels connected to Dev */}
                {/* 1. WhatsApp Top-Left */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-4 left-4 sm:left-12 z-20"
                >
                  <div className={cn("p-3 sm:p-4 rounded-2xl border shadow-xl flex items-center gap-3 hover:scale-110 transition-all duration-300", isDarkMode ? "bg-slate-900/95 text-white border-slate-800 shadow-slate-950/60 backdrop-blur-md" : "bg-white text-slate-900 border-slate-200/80 shadow-slate-200/50")}>
                    <WhatsAppLogo size={28} />
                    <div className="text-left hidden sm:block">
                      <div className={cn("text-xs font-extrabold", isDarkMode ? "text-white" : "text-slate-900")}>WhatsApp API</div>
                      <div className="text-[10px] text-emerald-500 font-bold">CONNECTED</div>
                    </div>
                  </div>
                </motion.div>

                {/* 2. Instagram Top-Right */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="absolute top-6 right-4 sm:right-10 z-20"
                >
                  <div className={cn("p-3 sm:p-4 rounded-2xl border shadow-xl flex items-center gap-3 hover:scale-110 transition-all duration-300", isDarkMode ? "bg-slate-900/95 text-white border-slate-800 shadow-slate-950/60 backdrop-blur-md" : "bg-white text-slate-900 border-slate-200/80 shadow-slate-200/50")}>
                    <InstagramLogo size={28} />
                    <div className="text-left hidden sm:block">
                      <div className={cn("text-xs font-extrabold", isDarkMode ? "text-white" : "text-slate-900")}>Instagram DMs</div>
                      <div className="text-[10px] text-pink-500 font-bold">LIVE SYNC</div>
                    </div>
                  </div>
                </motion.div>

                {/* 3. Facebook Bottom-Left */}
                <motion.div
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                  className="absolute bottom-6 left-6 sm:left-14 z-20"
                >
                  <div className={cn("p-3 sm:p-4 rounded-2xl border shadow-xl flex items-center gap-3 hover:scale-110 transition-all duration-300", isDarkMode ? "bg-slate-900/95 text-white border-slate-800 shadow-slate-950/60 backdrop-blur-md" : "bg-white text-slate-900 border-slate-200/80 shadow-slate-200/50")}>
                    <FacebookLogo size={28} />
                    <div className="text-left hidden sm:block">
                      <div className={cn("text-xs font-extrabold", isDarkMode ? "text-white" : "text-slate-900")}>Meta Lead Ads</div>
                      <div className="text-[10px] text-blue-500 font-bold">AUTO-ROUTED</div>
                    </div>
                  </div>
                </motion.div>

                {/* 4. YouTube Bottom-Right (COMING SOON) */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
                  className="absolute bottom-4 right-4 sm:right-12 z-20"
                >
                  <div className={cn("p-3 sm:p-4 rounded-2xl border shadow-xl flex items-center gap-3 hover:scale-110 transition-all duration-300", isDarkMode ? "bg-slate-900/95 text-white border-slate-800 shadow-slate-950/60 backdrop-blur-md" : "bg-white text-slate-900 border-slate-200/80 shadow-slate-200/50")}>
                    <YouTubeLogo size={28} />
                    <div className="text-left hidden sm:block">
                      <div className={cn("text-xs font-extrabold", isDarkMode ? "text-white" : "text-slate-900")}>YouTube Channel</div>
                      <div className="text-[9px] font-extrabold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded border border-red-500/20 uppercase">COMING SOON</div>
                    </div>
                  </div>
                </motion.div>

                {/* 5. Google News Feed Center Bottom */}
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 z-20"
                >
                  <div className={cn("px-4 py-2.5 rounded-xl border shadow-lg flex items-center gap-2 transition-all duration-300", isDarkMode ? "bg-slate-900/95 text-slate-200 border-slate-800 backdrop-blur-md" : "bg-white/90 text-slate-700 border-slate-200")}>
                    <GoogleNewsLogo size={20} />
                    <span className={cn("text-[11px] font-bold", isDarkMode ? "text-slate-200" : "text-slate-700")}>Google News Intel Stream</span>
                  </div>
                </motion.div>

              </motion.div>

            </div>
          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. VISUAL FLOW SECTION WITH GENEROUS SPACING                   */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. VISUAL FLOW SECTION WITH RICH BACKGROUND CONTAINER          */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full"
          >
            <div className="p-8 sm:p-14 lg:p-16 rounded-[2.5rem] bg-gradient-to-b from-slate-50/90 via-emerald-50/25 to-slate-50/90 dark:from-slate-900/90 dark:via-emerald-950/20 dark:to-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 shadow-2xl relative overflow-hidden space-y-14">
              
              {/* Ambient Background Glow Accents */}
              <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

              <div className="text-center space-y-3 max-w-2xl mx-auto relative z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                    UNIFIED INBOX FLOW
                  </span>
                </div>
                <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                  <span className="text-slate-900 dark:text-white">From Incoming Chat </span>
                  <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                    To Closed Response.
                  </span>
                </h2>
              </div>

              {/* Visual Step Nodes - Connected Flow Design (Modern Live Animated Workflow) */}
              <LiveUnifiedInboxWorkflow isDarkMode={isDarkMode} />

            </div>
          </motion.section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. INTERACTIVE VISUAL CHANNEL PREVIEW WITH SPACING            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 sm:py-20 space-y-12 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  CHANNEL DEMONSTRATION
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]">
                <span className="text-slate-900 dark:text-white">Select A Channel </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  To Preview Live.
                </span>
              </h2>
            </div>

            {/* Channel Tabs */}
            <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
              {channelsList.map((ch) => {
                const isActive = ch.id === activeChannel;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setActiveChannel(ch.id)}
                    className={cn(
                      "px-6 py-3.5 rounded-2xl text-xs font-extrabold flex items-center gap-2.5 transition-all cursor-pointer border",
                      isActive
                        ? ch.activeStyle
                        : "bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-slate-200 dark:border-slate-800 hover:border-slate-400 shadow-xs"
                    )}
                  >
                    {ch.logo}
                    <span>{ch.name}</span>
                    {!ch.isAvailable && (
                      <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 uppercase">COMING SOON</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Visual Channel Active Showcase Card */}
            <div className={cn(
              "p-8 sm:p-12 rounded-3xl border transition-all text-left grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl",
              activeData.lightBg,
              activeData.border
            )}>
              <div className="lg:col-span-6 space-y-6">
                <div className="flex items-center gap-3">
                  {activeData.logo}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{activeData.name}</h3>
                    <span className={cn("text-[10px] font-extrabold px-3 py-1 rounded-full border uppercase mt-1 inline-block", activeData.badge)}>
                      {activeData.status}
                    </span>
                  </div>
                </div>

                <p className="text-base font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {activeData.tagline}
                </p>

                {/* Conversation Fragment */}
                <div className="space-y-3.5 p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-xs">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Live Simulation</div>
                  <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 leading-relaxed">
                    <span className="font-bold text-[#0B8F78] block mb-0.5">{activeData.sampleSender}</span>
                    {activeData.sampleMsg}
                  </div>
                  <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-slate-900 dark:text-slate-100 border border-emerald-500/20 leading-relaxed">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Dev Auto-Dispatch</span>
                    {activeData.sampleReply}
                  </div>
                </div>
              </div>

              {/* Right Screenshot Fragment */}
              <div className="lg:col-span-6">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-slate-950 relative min-h-[300px] flex items-center justify-center">
                  {!activeData.isAvailable ? (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto border border-red-500/20 shadow-lg">
                        <YouTubeLogo size={36} />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[10px] font-black px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 uppercase tracking-widest inline-block">
                          ● COMING SOON
                        </span>
                        <h4 className="text-xl font-extrabold text-white">YouTube Integration</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Dev will automatically monitor video comments, auto-respond to viewer questions, and route subscriber inquiries straight into your inbox.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={activeData.screenshot}
                      alt={activeData.name}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

          </motion.section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 4. CALL TO ACTION WITH GENEROUS SPACING                        */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12"
          >
            <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white text-center space-y-6 relative overflow-hidden shadow-2xl border border-slate-800">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Ready to connect your channels?
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
                Join thousands of businesses managing WhatsApp, Instagram, and Facebook in one unified command center.
              </p>
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-9 py-4 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Start Free Trial</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </motion.section>

        </div>
      )}
    </LandingLayout>
  );
}

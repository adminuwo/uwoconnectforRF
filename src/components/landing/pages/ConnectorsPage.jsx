'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Sparkles, ArrowRight, CheckCircle2, Zap, Layers, RefreshCw, Activity, ArrowUpRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '../LandingLayout';
import {
  GmailLogo, OutlookLogo, GoogleSheetsLogo, GoogleDocsLogo,
  OneDriveLogo, GoogleMapsLogo, GoogleSlidesLogo, GoogleNewsLogo
} from '../LandingBrandLogos';
import { motion } from 'framer-motion';

export default function ConnectorsPage() {
  const router = useRouter();
  const [activeConnector, setActiveConnector] = useState('google-sheets');

  const connectorsData = [
    {
      id: 'gmail',
      name: 'Gmail',
      logo: <GmailLogo size={32} />,
      label: '2-way Email Sync',
      tagline: 'Inbox thread auto-routing & dynamic attachments',
      badge: 'Google Workspace',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-red-50 dark:bg-red-950/40 border-2 border-red-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-red-50/80 dark:bg-red-950/40',
      border: 'border-red-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: email_received • Customer lead saved to CRM',
      screenshot: '/dashboard/dashboard_inbox.png',
    },
    {
      id: 'outlook',
      name: 'Microsoft Outlook',
      logo: <OutlookLogo size={32} />,
      label: 'Exchange & Teams',
      tagline: 'Calendar check & auto Teams demo scheduling',
      badge: 'Microsoft 365',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-blue-50/80 dark:bg-blue-950/40',
      border: 'border-blue-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: calendar_checked • 11:30 AM Slot Confirmed',
      screenshot: '/dashboard/dashboard_connectors.png',
    },
    {
      id: 'google-sheets',
      name: 'Google Sheets',
      logo: <GoogleSheetsLogo size={32} />,
      label: 'Live Real-time Database',
      tagline: 'Auto-logs leads, GST quotes & payment rows',
      badge: 'Google Workspace',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      border: 'border-emerald-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: sheet_row_appended • GST Invoice #2901 Logged',
      screenshot: '/dashboard/dashboard_crm.png',
    },
    {
      id: 'google-docs',
      name: 'Google Docs',
      logo: <GoogleDocsLogo size={32} />,
      label: 'Document Engine',
      tagline: 'Fills contract templates & exports signed PDFs',
      badge: 'Google Workspace',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-blue-50/80 dark:bg-blue-950/40',
      border: 'border-blue-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: pdf_compiled • Service Agreement PDF Ready',
      screenshot: '/dashboard/dashboard_quotations.png',
    },
    {
      id: 'onedrive',
      name: 'OneDrive',
      logo: <OneDriveLogo size={32} />,
      label: 'Cloud Archive',
      tagline: 'Secure KYC vaults & product catalog storage',
      badge: 'Microsoft 365',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-sky-50 dark:bg-sky-950/40 border-2 border-sky-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-sky-50/80 dark:bg-sky-950/40',
      border: 'border-sky-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: file_vaulted • Client KYC Stored securely',
      screenshot: '/dashboard/dashboard_connectors.png',
    },
    {
      id: 'google-maps',
      name: 'Google Maps',
      logo: <GoogleMapsLogo size={32} />,
      label: 'Geo-Routing',
      tagline: 'Address pin lookup & delivery radius calculation',
      badge: 'Location API',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      border: 'border-emerald-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: geo_verified • Pin Code 560001 Confirmed',
      screenshot: '/dashboard/dashboard_connectors.png',
    },
    {
      id: 'google-slides',
      name: 'Google Slides',
      logo: <GoogleSlidesLogo size={32} />,
      label: 'Pitch Decks',
      tagline: 'Dynamic pitch deck generation for enterprise deals',
      badge: 'Google Workspace',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-amber-50/80 dark:bg-amber-950/40',
      border: 'border-amber-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: deck_generated • Enterprise Pitch Deck Ready',
      screenshot: '/dashboard/dashboard_connectors.png',
    },
    {
      id: 'google-news',
      name: 'Google News Feed',
      logo: <GoogleNewsLogo size={32} />,
      label: 'Industry Intel',
      tagline: 'Live market news & competitor update feeds',
      badge: 'Information Stream',
      status: 'COMING SOON',
      isAvailable: false,
      activeStyle: 'bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-500 text-slate-900 dark:text-white shadow-xl scale-105',
      lightBg: 'bg-blue-50/80 dark:bg-blue-950/40',
      border: 'border-blue-500/30',
      badgeStyle: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30',
      sampleUI: 'Event: news_synced • Daily Market Digest Ready',
      screenshot: '/dashboard/dashboard_connectors.png',
    }
  ];

  const activeItem = connectorsData.find(c => c.id === activeConnector) || connectorsData[2];

  return (
    <LandingLayout activePage="connectors">
      {({ isDarkMode }) => (
        <div className="flex flex-col gap-24 sm:gap-36 lg:gap-48 py-16 sm:py-24 lg:py-32 overflow-hidden">

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 1. HERO SECTION: DEV & CONNECTED ECOSYSTEM                    */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-12 pt-4 pb-12 sm:pb-20">

            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-4"
            >
              {/* Top Pill Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  Dev • Zero-Code Integrations
                </span>
              </div>

              {/* Main Headline Format */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.08]">
                <span className={cn(isDarkMode ? "text-white" : "text-slate-900")}>Connect The Tools </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  You Already Use.
                </span>
              </h1>

              <p className={cn(
                "text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto",
                isDarkMode ? "text-slate-300" : "text-slate-600"
              )}>
                Dev seamlessly links your email, spreadsheets, cloud docs, maps, and news feeds directly into UWO Connect.
              </p>
            </motion.div>

            {/* Visual Orbital Hub: DEV in Center surrounded by Connectors */}
            <div className="relative max-w-5xl mx-auto min-h-[460px] sm:min-h-[520px] flex items-center justify-center pt-4">
              
              {/* Radial Glowing Ring Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-transparent rounded-full blur-3xl" />
              
              {/* Outer Circular SVG Connection Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-blue-500 dark:stroke-blue-400" viewBox="0 0 800 500" fill="none">
                <circle cx="400" cy="250" r="180" strokeWidth="1.5" strokeDasharray="6 6" />
                <circle cx="400" cy="250" r="230" strokeWidth="1" />
                <line x1="160" y1="120" x2="400" y2="250" strokeWidth="1.5" />
                <line x1="640" y1="120" x2="400" y2="250" strokeWidth="1.5" />
                <line x1="160" y1="380" x2="400" y2="250" strokeWidth="1.5" />
                <line x1="640" y1="380" x2="400" y2="250" strokeWidth="1.5" />
              </svg>

              {/* Central Dev Character */}
              <div className="relative z-10 flex flex-col items-center">
                <div className="relative group">
                  <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 opacity-20 blur-xl group-hover:opacity-40 transition-opacity" />
                  <img
                    src="/Dev_transparent.png"
                    alt="Dev Integration Engine"
                    className="w-48 sm:w-56 md:w-64 h-auto object-contain drop-shadow-2xl relative z-10 hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Orbital Connector Badges Around Dev (Shown in Light Mode only) */}
              {!isDarkMode && (
                <>
                  {/* 1. Gmail - Top Left */}
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute top-4 left-4 sm:left-12 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <GmailLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Gmail</span>
                    </div>
                  </motion.div>

                  {/* 2. Google Sheets - Top Center-Right */}
                  <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4.5, repeat: Infinity, delay: 0.3 }} className="absolute top-2 right-12 sm:right-24 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <GoogleSheetsLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Google Sheets</span>
                    </div>
                  </motion.div>

                  {/* 3. Google Docs - Top Far Right */}
                  <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.6 }} className="absolute top-20 right-2 sm:right-8 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <GoogleDocsLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Google Docs</span>
                    </div>
                  </motion.div>

                  {/* 4. Outlook - Middle Left */}
                  <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4.2, repeat: Infinity, delay: 0.9 }} className="absolute top-1/3 left-2 sm:left-6 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <OutlookLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Outlook</span>
                    </div>
                  </motion.div>

                  {/* 5. OneDrive - Bottom Left */}
                  <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 4.8, repeat: Infinity, delay: 1.2 }} className="absolute bottom-10 left-6 sm:left-16 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <OneDriveLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">OneDrive</span>
                    </div>
                  </motion.div>

                  {/* 6. Google Maps - Bottom Right */}
                  <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 4.4, repeat: Infinity, delay: 1.5 }} className="absolute bottom-8 right-8 sm:right-20 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <GoogleMapsLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Google Maps</span>
                    </div>
                  </motion.div>

                  {/* 7. Google Slides - Top Left Center */}
                  <motion.div animate={{ y: [0, -5, 0] }} transition={{ duration: 3.8, repeat: Infinity, delay: 0.4 }} className="absolute top-16 left-28 sm:left-44 z-20">
                    <div className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5 hover:scale-110 transition-transform">
                      <GoogleSlidesLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white hidden sm:inline">Google Slides</span>
                    </div>
                  </motion.div>

                  {/* 8. Google News Feed - Bottom Center */}
                  <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} className="absolute -bottom-6 z-20">
                    <div className="px-4 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 shadow-xl flex items-center gap-2.5">
                      <GoogleNewsLogo size={24} />
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">Google News Feed</span>
                    </div>
                  </motion.div>
                </>
              )}

            </div>

          </section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 2. VISUAL CONNECTED ECOSYSTEM FLOW WITH SPACING               */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-12 sm:py-20 space-y-14 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md shadow-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300 tracking-wide">
                  LIVE DATA FLOW
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight leading-[1.12]">
                <span className="text-slate-900 dark:text-white">How Tools Work Together </span>
                <span className="bg-gradient-to-r from-[#0B8F78] via-[#0F766E] to-[#2563EB] bg-clip-text text-transparent">
                  Inside UWO Connect.
                </span>
                <span className="ml-3 align-middle text-xs font-black px-2.5 py-1 rounded-full bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 uppercase tracking-tight inline-block">
                  COMING SOON
                </span>
              </h2>
            </div>

            {/* Horizontal Interactive Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
              {connectorsData.map((c) => {
                const isActive = c.id === activeConnector;
                return (
                  <button
                    key={c.id}
                    onClick={() => setActiveConnector(c.id)}
                    className={cn(
                      "p-3.5 rounded-2xl text-center space-y-2 border transition-all cursor-pointer flex flex-col items-center justify-center relative group",
                      isActive
                        ? c.activeStyle
                        : "bg-white dark:bg-transparent text-slate-900 dark:text-white border-slate-200 dark:border-slate-800/60 hover:border-[#0B8F78] shadow-xs"
                    )}
                  >
                    <div>{c.logo}</div>
                    <span className="text-[11px] font-extrabold block truncate w-full">{c.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Visual Ecosystem Card (LIGHT THEME MATCHING CHANNELS) */}
            <div className={cn(
              "p-8 sm:p-12 rounded-3xl border transition-all text-left grid grid-cols-1 lg:grid-cols-12 gap-10 items-center shadow-xl",
              isDarkMode ? "bg-transparent border-slate-800/80" : activeItem.lightBg,
              activeItem.border
            )}>
              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  {activeItem.logo}
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{activeItem.name}</h3>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-[#0B8F78] dark:text-emerald-400">{activeItem.label}</h4>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">{activeItem.tagline}</p>

                <div className="p-4 rounded-xl bg-white dark:bg-transparent border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-emerald-300 shadow-xs leading-relaxed">
                  {activeItem.sampleUI}
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => router.push('/auth/register')}
                    className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white text-xs font-bold shadow-lg shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{activeItem.isAvailable ? `Connect ${activeItem.name}` : `Get Notified For ${activeItem.name}`}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Product UI Screenshot */}
              <div className="lg:col-span-7">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-2xl bg-slate-950 relative min-h-[300px] flex items-center justify-center">
                  {!activeItem.isAvailable ? (
                    <div className="p-8 text-center space-y-4 max-w-md mx-auto relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto border border-slate-800 shadow-lg">
                        {activeItem.logo}
                      </div>
                      <div className="space-y-2">
                        <h4 className="text-xl font-extrabold text-white">{activeItem.name} Integration</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Dev is actively building automated {activeItem.name} workflows to sync data seamlessly with your team dashboard.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={activeItem.screenshot}
                      alt={activeItem.name}
                      className="w-full h-auto object-cover"
                    />
                  )}
                </div>
              </div>
            </div>

          </motion.section>


          {/* ══════════════════════════════════════════════════════════════ */}
          {/* 3. CTA WITH SPACING                                            */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <motion.section
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 pb-12"
          >
            <div className="p-12 sm:p-16 rounded-3xl bg-gradient-to-r from-blue-900 via-slate-900 to-slate-900 text-white text-center space-y-6 shadow-2xl border border-slate-800">
              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Connect your business stack in 30 seconds.
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
                No complex API keys or coding required. Dev handles all authentication automatically.
              </p>
              <div className="flex justify-center pt-4">
                <button
                  type="button"
                  onClick={() => router.push('/auth/register')}
                  className="px-9 py-4 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] hover:from-[#097361] hover:to-[#0B8F78] text-white font-bold text-sm shadow-xl shadow-emerald-700/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Connectors Free</span>
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

'use client';

import React from 'react';
import {
  Building2,
  Award,
  Globe,
  MapPin,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Scale,
  ShoppingBag,
  Workflow,
  Sparkles,
  Quote,
  GraduationCap,
  ArrowUpRight,
  TrendingUp,
  Layers,
  Sparkle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import LandingLayout from '@/components/landing/LandingLayout';

export default function AboutClient() {
  const projects = [
    {
      layer: 'Layer 01 • Command Center',
      name: 'AISA™',
      tagline: 'AI Super Assistant',
      desc: 'Unified interface layer with multi-session memory, multi-modal utility, and intent-based agent routing.',
      logo: '/about-uwo/aisa-logo.png',
      badge: 'Interface Layer',
      accentColor: 'from-rose-500/20 to-orange-500/20 text-rose-500 border-rose-500/30',
      glow: 'group-hover:border-rose-500/50 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
      url: 'https://aisa24.com'
    },
    {
      layer: 'Layer 02 • Sovereign Vertical OS',
      name: 'AI LEGAL™',
      tagline: 'Legal Intelligence',
      desc: 'Precision-grounded in 75+ years of Indian jurisprudence with zero hallucination & Sec 65B evidence hashing.',
      logo: '/about-uwo/ailegal.png',
      badge: 'Legal Tech OS',
      accentColor: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30',
      glow: 'group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
      url: 'https://uwo24.com/ai-legal'
    },
    {
      layer: 'Layer 03 • Discovery & Distribution',
      name: 'AI Mall™',
      tagline: 'Enterprise Tools Marketplace',
      desc: 'Curated enterprise AI marketplace reducing custom deployment cycles from months to mere minutes.',
      logo: '/about-uwo/aimall.png',
      badge: 'App Ecosystem',
      accentColor: 'from-cyan-500/20 to-teal-500/20 text-cyan-500 border-cyan-500/30',
      glow: 'group-hover:border-cyan-500/50 group-hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
      url: 'https://aimall24.com/'
    },
    {
      layer: 'Layer 04 • Enterprise Automation',
      name: 'AISA Connect™',
      tagline: 'Omnichannel Infrastructure',
      desc: 'Natively connects WhatsApp, web chat, and email directly into corporate CRMs, ERPs, and live team workflows.',
      logo: '/about-uwo/uwoconnect.png',
      badge: 'Omnichannel SaaS',
      accentColor: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
      glow: 'group-hover:border-emerald-500/50 group-hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
      url: 'https://uwo24.com/projects/uwo-connect'
    },
    {
      layer: 'Layer 05 • Human Operating System',
      name: 'EFV™ Framework',
      tagline: 'Energy, Frequency & Vibration',
      desc: '9-level consciousness and workforce execution discipline authored by Gurumukh P. Ahuja across 175 countries.',
      logo: '/about-uwo/efv.png',
      badge: 'Human Readiness',
      accentColor: 'from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-500/30',
      glow: 'group-hover:border-amber-500/50 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
      url: 'https://efv.uwo.in/'
    },
    {
      layer: 'Layer 06 • Sovereign Governance',
      name: 'UWO Institutional OS™',
      tagline: 'Evidence-Driven Governance',
      desc: 'Enterprise-grade operational compliance tracking, rigorous RBAC, and immutable audit trails.',
      logo: '/about-uwo/uwo-logo.png',
      badge: 'SOP & Compliance',
      accentColor: 'from-purple-500/20 to-indigo-500/20 text-purple-500 border-purple-500/30',
      glow: 'group-hover:border-purple-500/50 group-hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]',
      url: 'https://uwo24.com'
    }
  ];

  const academicList = [
    { name: 'DNLU Jabalpur', type: 'Dharmashastra National Law University', city: 'Jabalpur, MP' },
    { name: 'Army Institute of Law (AIL)', type: 'Premier Legal Institution', city: 'Mohali, Punjab' },
    { name: 'PIMR Indore', type: 'Prestige Institute of Mgmt & Research', city: 'Indore, MP' },
    { name: 'A. P. Narmada Law College', type: 'Historic 150+ Year Heritage (ESTD. 1871)', city: 'Jabalpur Cantt' },
    { name: 'RDVV Jabalpur', type: 'Rani Durgavati Vishwavidyalaya', city: 'Jabalpur, MP' },
    { name: 'SGTB Khalsa College', type: 'Sri Guru Tegh Bahadur Khalsa College', city: 'Jabalpur, MP' }
  ];

  return (
    <LandingLayout activePage="about">
      {({ isDarkMode }) => (
        <div className={cn(
          "relative w-full overflow-hidden transition-colors duration-300 font-sans",
          isDarkMode ? "bg-[#050811] text-white" : "bg-[#FAFCFF] text-slate-900"
        )}>

          {/* BACKGROUND AMBIENT GLOWS & GRID */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[550px] bg-gradient-to-b from-[#0B8F78]/15 via-teal-500/5 to-transparent blur-[160px] pointer-events-none rounded-full" />
          <div className="absolute top-[800px] right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] pointer-events-none rounded-full" />
          <div className="absolute top-[1800px] left-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[160px] pointer-events-none rounded-full" />

          {/* MAIN WRAPPER */}
          <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 1. CORPORATE PROFILE HERO                                      */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className="pb-24 sm:pb-32">

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left 7 Columns: Text, Badges, Mission */}
                <div className="lg:col-span-8 space-y-7">

                  {/* Recognition Badges */}
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border shadow-xs transition-all",
                      isDarkMode
                        ? "bg-emerald-950/70 border-emerald-500/40 text-emerald-300"
                        : "bg-emerald-50 border-emerald-300 text-emerald-950"
                    )}>
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      DPIIT Recognized Startup
                    </span>

                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border shadow-xs",
                      isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-slate-200"
                        : "bg-white border-slate-300 text-slate-800"
                    )}>
                      <Building2 size={13} className="text-blue-500" />
                      DUNS Registered
                    </span>

                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black tracking-wide border shadow-xs",
                      isDarkMode
                        ? "bg-slate-900/80 border-slate-700 text-slate-200"
                        : "bg-white border-slate-300 text-slate-800"
                    )}>
                      <Award size={13} className="text-amber-500" />
                      Incubated at IIT Ropar – TBIF
                    </span>
                  </div>

                  {/* Title & Headline */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-xs font-black text-[#0B8F78] uppercase tracking-widest">
                      <Sparkle size={12} className="fill-[#0B8F78]" />
                      <span>Corporate Profile &amp; Heritage</span>
                    </div>

                    <h1 className={cn(
                      "text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08]",
                      isDarkMode
                        ? "bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent"
                        : "text-slate-950"
                    )}>
                      Unified Web Options &amp; Services Pvt. Ltd.
                    </h1>

                    <p className="text-xl sm:text-2xl font-extrabold text-[#0B8F78] leading-snug pt-2">
                      Building an Integrated AI Adoption Infrastructure Stack that transitions organizations from fragmented tools to measurable, AI-powered execution.
                    </p>
                  </div>

                  {/* Concise Narrative */}
                  <p className={cn(
                    "text-base sm:text-lg leading-relaxed font-medium max-w-2xl",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  )}>
                    Founded in <strong>2020</strong> and headquartered in <strong>Jabalpur, Madhya Pradesh</strong>, UWO™ architects sovereign, enterprise-grade AI systems combining <strong>AISA™</strong>, <strong>AI LEGAL™</strong>, <strong>AI Mall™</strong>, <strong>AISA Connect™</strong>, and the <strong>EFV™ Framework</strong> worldwide across <strong>175+ countries</strong>.
                  </p>

                </div>

                {/* Right 4 Columns: Glowing Globe & Sovereign Seal */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center">
                  <div className="relative group">
                    {/* Glowing Aura Behind Globe */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#0B8F78]/30 via-teal-500/20 to-blue-500/20 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />

                    <div className={cn(
                      "relative p-8 rounded-3xl border backdrop-blur-xl flex flex-col items-center text-center shadow-xl transition-all duration-300 group-hover:border-[#0B8F78]/60",
                      isDarkMode
                        ? "bg-slate-900/60 border-slate-800"
                        : "bg-white/80 border-slate-200"
                    )}>
                      <img
                        src="/about-uwo/uwo-globe.png"
                        alt="UWO Global Footprint"
                        className="w-48 h-48 sm:w-56 sm:h-56 object-contain drop-shadow-[0_10px_25px_rgba(11,143,120,0.3)] animate-pulse"
                        style={{ animationDuration: '4s' }}
                      />

                      <div className="mt-4 space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#0B8F78]">
                          Sovereign AI Infrastructure
                        </span>
                        <p className={cn("text-sm font-black", isDarkMode ? "text-white" : "text-slate-900")}>
                          Headquartered in Jabalpur, MP
                        </p>
                        <p className="text-xs text-slate-500 font-bold">
                          Live across 175+ Countries
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* High-Impact Metrics Strip (Glassmorphism + Subtle Gradient Accent) */}
              <div className={cn(
                "mt-14 p-6 sm:p-8 rounded-3xl border backdrop-blur-md shadow-lg grid grid-cols-2 sm:grid-cols-5 gap-6 sm:gap-8",
                isDarkMode
                  ? "bg-slate-900/50 border-slate-800/80 shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
                  : "bg-white/90 border-slate-200 shadow-[0_4px_30px_rgba(11,143,120,0.06)]"
              )}>
                {[
                  { value: '2020', label: 'Year Founded', sub: 'Inception' },
                  { value: '175+', label: 'Countries Reached', sub: 'Global Footprint' },
                  { value: '3 / 100+', label: 'Patents & IP', sub: 'Trademarks Filed' },
                  { value: '30+', label: 'Core Team Strength', sub: 'AI & Engineers' },
                  { value: 'IIT Ropar', label: 'TBIF Incubated', sub: 'DeepTech Backed' },
                ].map((stat, idx) => (
                  <div key={idx} className="space-y-1 text-center sm:text-left">
                    <div className="text-2xl sm:text-4xl font-black text-[#0B8F78] tracking-tight">
                      {stat.value}
                    </div>
                    <div className={cn("text-xs font-black uppercase tracking-wider", isDarkMode ? "text-white" : "text-slate-900")}>
                      {stat.label}
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium">
                      {stat.sub}
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 2. FOUNDER & ECOSYSTEM LEADERSHIP                              */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className={cn(
              "py-24 sm:py-32 border-t",
              isDarkMode ? "border-slate-800/80" : "border-slate-200/80"
            )}>

              <div className="space-y-2 mb-12">
                <span className="text-[11px] font-black text-[#0B8F78] uppercase tracking-widest block">
                  Founder &amp; Ecosystem Leadership
                </span>
                <h2 className={cn(
                  "text-2xl sm:text-4xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  Architecting Human &amp; Machine Consciousness
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-500 max-w-3xl">
                  Leading the convergence of sovereign AI infrastructure, human alignment, and legal workflow automation from India to the world.
                </p>
              </div>

              {/* Founder Keynote Presentation */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">

                {/* Left 4 Cols: Executive Portrait Card */}
                <div className="lg:col-span-4 flex flex-col items-center sm:items-start space-y-4">
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#0B8F78] to-teal-500 rounded-3xl blur-lg opacity-30 group-hover:opacity-60 transition duration-500" />
                    <div className={cn(
                      "relative p-3 rounded-2xl border backdrop-blur-md",
                      isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200 shadow-md"
                    )}>
                      <img
                        src="/about-uwo/founder-gurumukh.jpg"
                        alt="Gurumukh P. Ahuja - Founder & CEO"
                        className="w-56 h-64 sm:w-64 sm:h-72 object-cover object-top rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5 text-center sm:text-left">
                    <h3 className={cn("text-2xl font-black tracking-tight", isDarkMode ? "text-white" : "text-slate-950")}>
                      Gurumukh P. Ahuja
                    </h3>
                    <p className="text-sm font-extrabold text-[#0B8F78]">
                      Founder &amp; Chief Executive Officer
                    </p>
                    <p className="text-xs text-slate-500 font-bold">
                      Unified Web Options &amp; Services Pvt. Ltd. (UWO™)
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2 justify-center sm:justify-start">
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                        20+ Yrs High-Stakes Entrepreneur
                      </span>
                      <span className="px-3 py-1 rounded-full text-[11px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30">
                        Rotary Leadership
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right 8 Cols: Bio, 4 Interactive Highlights & Quote */}
                <div className="lg:col-span-8 space-y-8">

                  <p className={cn(
                    "text-base sm:text-lg leading-relaxed font-medium",
                    isDarkMode ? "text-slate-300" : "text-slate-700"
                  )}>
                    Gurumukh P. Ahuja brings over 20 years of high-stakes entrepreneurship, large-scale infrastructure development, and institutional governance to the helm of UWO™. With deep exposure across public institutions, high-level Rotary leadership, and nationwide commercial ventures, he champions technology that serves tangible, measurable execution rather than speculative hype.
                  </p>

                  {/* 4 Interactive Feature Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    <div className={cn(
                      "p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.01]",
                      isDarkMode ? "bg-slate-900/60 border-slate-800 hover:border-[#0B8F78]/50" : "bg-white border-slate-200 hover:border-[#0B8F78]/50 shadow-2xs"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0B8F78]" />
                        <h4 className="text-xs font-black text-[#0B8F78] uppercase tracking-wider">
                          System Architect &amp; Author
                        </h4>
                      </div>
                      <p className={cn("text-xs sm:text-sm font-medium mt-1 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        Creator of the proprietary EFV™ Framework and EFV Master Series™ published across 175 countries.
                      </p>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.01]",
                      isDarkMode ? "bg-slate-900/60 border-slate-800 hover:border-[#0B8F78]/50" : "bg-white border-slate-200 hover:border-[#0B8F78]/50 shadow-2xs"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0B8F78]" />
                        <h4 className="text-xs font-black text-[#0B8F78] uppercase tracking-wider">
                          Multi-Agent Ecosystem Builder
                        </h4>
                      </div>
                      <p className={cn("text-xs sm:text-sm font-medium mt-1 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        Visionary architect behind UWO’s AI stack: AISA™, AI LEGAL™, AISA Connect™, AI Mall™.
                      </p>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.01]",
                      isDarkMode ? "bg-slate-900/60 border-slate-800 hover:border-[#0B8F78]/50" : "bg-white border-slate-200 hover:border-[#0B8F78]/50 shadow-2xs"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0B8F78]" />
                        <h4 className="text-xs font-black text-[#0B8F78] uppercase tracking-wider">
                          Institutional Credibility
                        </h4>
                      </div>
                      <p className={cn("text-xs sm:text-sm font-medium mt-1 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        Backed by high-level Rotary leadership, public institutional engagements, and IIT Ropar – TBIF.
                      </p>
                    </div>

                    <div className={cn(
                      "p-4 rounded-xl border transition-all duration-200 group hover:scale-[1.01]",
                      isDarkMode ? "bg-slate-900/60 border-slate-800 hover:border-[#0B8F78]/50" : "bg-white border-slate-200 hover:border-[#0B8F78]/50 shadow-2xs"
                    )}>
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#0B8F78]" />
                        <h4 className="text-xs font-black text-[#0B8F78] uppercase tracking-wider">
                          30+ Engineering Strength
                        </h4>
                      </div>
                      <p className={cn("text-xs sm:text-sm font-medium mt-1 leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        Steering a dedicated product &amp; AI workforce proving world-class deep tech thrives from Jabalpur.
                      </p>
                    </div>

                  </div>

                  {/* Vision Quote Card */}
                  <div className={cn(
                    "relative p-6 rounded-2xl border-l-4 border-l-[#0B8F78] backdrop-blur-md space-y-2 shadow-xs",
                    isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-emerald-50/50 border-emerald-100"
                  )}>
                    <div className="flex items-start gap-3">
                      <Quote size={24} className="text-[#0B8F78] shrink-0 mt-0.5" />
                      <div className="space-y-2">
                        <p className={cn("text-sm sm:text-base italic font-semibold leading-relaxed", isDarkMode ? "text-white" : "text-slate-950")}>
                          “The future belongs to companies that combine artificial intelligence &amp; automation with consciousness, human understanding, and sovereign execution discipline.”
                        </p>
                        <p className="text-xs font-black text-[#0B8F78] not-italic">
                          — Gurumukh P. Ahuja, Founder &amp; CEO
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </section>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 3. PROPRIETARY ARCHITECTURE: THE UWO™ ADOPTION STACK           */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className={cn(
              "py-24 sm:py-32 border-t",
              isDarkMode ? "border-slate-800/80" : "border-slate-200/80"
            )}>

              <div className="space-y-2 mb-12">
                <span className="text-[11px] font-black text-[#0B8F78] uppercase tracking-widest block">
                  Proprietary Architecture
                </span>
                <h2 className={cn(
                  "text-2xl sm:text-4xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  The UWO™ Adoption Stack
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-500 max-w-3xl">
                  A cohesive multi-layer ecosystem connecting interaction, sovereign vertical intelligence, automation, and human readiness.
                </p>
              </div>

              {/* 6 High-Tech Product Cards with Signature Glows */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj, pIdx) => (
                  <div
                    key={pIdx}
                    className={cn(
                      "group relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1",
                      isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm",
                      proj.glow
                    )}
                  >
                    <div className="space-y-4">

                      {/* Header with Layer Tag & Logo */}
                      <div className="flex items-center justify-between">
                        <span className={cn(
                          "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border bg-gradient-to-r",
                          proj.accentColor
                        )}>
                          {proj.badge}
                        </span>

                        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 p-1.5 flex items-center justify-center border border-slate-200 dark:border-slate-700 shadow-2xs group-hover:scale-110 transition-transform">
                          <img
                            src={proj.logo}
                            alt={proj.name}
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                      </div>

                      {/* Title & Tagline */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          {proj.layer}
                        </span>
                        <h3 className={cn("text-lg font-black tracking-tight mt-0.5", isDarkMode ? "text-white" : "text-slate-950")}>
                          {proj.name}
                        </h3>
                        <p className="text-xs font-bold text-[#0B8F78] mt-0.5">
                          {proj.tagline}
                        </p>
                      </div>

                      {/* Description */}
                      <p className={cn("text-xs sm:text-sm leading-relaxed font-medium", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                        {proj.desc}
                      </p>

                    </div>

                    {/* Launch Action */}
                    <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500">
                        Explore Platform
                      </span>
                      <a
                        href={proj.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-black text-white bg-[#0B8F78] hover:bg-[#097562] transition-colors shadow-xs"
                      >
                        <span>Launch</span>
                        <ArrowUpRight size={13} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>

            </section>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 4. INSTITUTIONAL CREDENTIALS & ACADEMIC ENGAGEMENTS            */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className={cn(
              "py-24 sm:py-32 border-t",
              isDarkMode ? "border-slate-800/80" : "border-slate-200/80"
            )}>

              <div className="space-y-2 mb-12">
                <span className="text-[11px] font-black text-[#0B8F78] uppercase tracking-widest block">
                  Institutional Credentials
                </span>
                <h2 className={cn(
                  "text-2xl sm:text-4xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  Incubations &amp; Academic Engagements
                </h2>
                <p className="text-sm sm:text-base font-semibold text-slate-500 max-w-3xl">
                  Validated by premier national technology business incubators, leading law universities, and business institutes across India.
                </p>
              </div>

              {/* 2 Featured Primary Incubations */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">

                <div className={cn(
                  "p-6 sm:p-7 rounded-2xl border flex items-center justify-between gap-6 transition-all hover:border-amber-500/50",
                  isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                )}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/20">
                      Incubated Enterprise
                    </span>
                    <h3 className={cn("text-xl font-black tracking-tight pt-1", isDarkMode ? "text-white" : "text-slate-950")}>
                      IIT Ropar – TBIF
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      Technology Business Incubator Foundation, Punjab
                    </p>
                    <p className={cn("text-xs font-medium pt-1", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                      Validated under India’s premier DeepTech &amp; Startup incubation frameworks.
                    </p>
                  </div>
                  <img src="/about-uwo/tbif.png" alt="IIT Ropar TBIF" className="h-9 w-auto object-contain shrink-0 drop-shadow-sm" />
                </div>

                <div className={cn(
                  "p-6 sm:p-7 rounded-2xl border flex items-center justify-between gap-6 transition-all hover:border-blue-500/50",
                  isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-white border-slate-200 shadow-sm"
                )}>
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-md border border-blue-500/20">
                      Talent &amp; Research
                    </span>
                    <h3 className={cn("text-xl font-black tracking-tight pt-1", isDarkMode ? "text-white" : "text-slate-950")}>
                      SIBM Nagpur
                    </h3>
                    <p className="text-xs text-slate-500 font-bold">
                      Symbiosis Institute of Business Management
                    </p>
                    <p className={cn("text-xs font-medium pt-1", isDarkMode ? "text-slate-300" : "text-slate-600")}>
                      Ongoing management, marketing intelligence, and corporate strategy talent incubation.
                    </p>
                  </div>
                  <GraduationCap size={32} className="text-blue-500 shrink-0" />
                </div>

              </div>

              {/* Law & University Faculties Strip */}
              <div className="space-y-4">
                <p className="text-xs font-black uppercase tracking-wider text-[#0B8F78]">
                  Academic Engagements Appreciated By Premier Law &amp; University Faculties
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {academicList.map((inst, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-4 rounded-xl border space-y-1 transition-all hover:border-slate-400 dark:hover:border-slate-600",
                        isDarkMode ? "bg-slate-900/40 border-slate-800" : "bg-slate-50 border-slate-200 shadow-2xs"
                      )}
                    >
                      <h4 className={cn("font-black text-sm tracking-tight", isDarkMode ? "text-white" : "text-slate-950")}>
                        {inst.name}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {inst.type}
                      </p>
                      <p className="text-[11px] font-bold text-[#0B8F78]">
                        {inst.city}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </section>

            {/* ══════════════════════════════════════════════════════════════ */}
            {/* 5. HEADQUARTERS & CORPORATE OFFICE                             */}
            {/* ══════════════════════════════════════════════════════════════ */}
            <section className={cn(
              "pt-24 sm:pt-32 pb-16 border-t",
              isDarkMode ? "border-slate-800/80" : "border-slate-200/80"
            )}>

              <div className="space-y-2 mb-10">
                <span className="text-[11px] font-black text-[#0B8F78] uppercase tracking-widest block">
                  Headquarters &amp; Corporate Office
                </span>
                <h2 className={cn(
                  "text-2xl sm:text-4xl font-black tracking-tight",
                  isDarkMode ? "text-white" : "text-black"
                )}>
                  Unified Web Options &amp; Services Pvt. Ltd.
                </h2>
                <p className="text-sm font-semibold text-slate-500">
                  Connect directly with our corporate leadership, institutional partnership division, or AI Legal™ enterprise onboarding desk.
                </p>
              </div>

              {/* 4 Details Columns with border separation & icons */}
              <div className={cn(
                "pt-8 border-t grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs sm:text-sm",
                isDarkMode ? "border-slate-800" : "border-slate-200"
              )}>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-black text-[#0B8F78] uppercase text-xs">
                    <MapPin size={15} />
                    <span>Headquarters</span>
                  </div>
                  <p className={cn("font-semibold leading-relaxed", isDarkMode ? "text-slate-300" : "text-slate-800")}>
                    4th Floor, SG Square, near PNB Bank, Rampur Chowk, Jabalpur, MP – 482008
                  </p>
                  <a
                    href="https://maps.google.com/?q=SG+Square,+Rampur+Chowk,+Jabalpur,+Madhya+Pradesh+482008"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#0B8F78] font-bold hover:underline pt-1 text-xs"
                  >
                    <span>Directions on Maps</span>
                    <ExternalLink size={12} />
                  </a>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-black text-[#0B8F78] uppercase text-xs">
                    <Mail size={15} />
                    <span>Official Correspondence</span>
                  </div>
                  <p className="font-bold">
                    <a href="mailto:ai.legal@uwo24.com" className="hover:underline">
                      ai.legal@uwo24.com
                    </a>
                  </p>
                  <p className="text-slate-500 font-medium">
                    General: <a href="mailto:connect@uwo24.com" className="hover:underline text-[#0B8F78]">connect@uwo24.com</a>
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-black text-[#0B8F78] uppercase text-xs">
                    <Phone size={15} />
                    <span>Corporate Helpdesk</span>
                  </div>
                  <p className="font-bold">
                    +91 7389999999 / 8871190020
                  </p>
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Clock size={12} className="text-[#0B8F78]" />
                    <span>Mon – Sat (9:30 AM – 6:30 PM IST)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 font-black text-[#0B8F78] uppercase text-xs">
                    <Globe size={15} />
                    <span>Global Ecosystem</span>
                  </div>
                  <p className="font-bold">
                    Live across 175+ Countries
                  </p>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Sovereign AI systems deployed internationally.
                  </p>
                </div>

              </div>

            </section>

          </div>
        </div>
      )}
    </LandingLayout>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ExternalLink, 
  Globe, 
  ArrowUpRight, 
  Layers, 
  Cpu, 
  ShieldCheck, 
  ShoppingBag, 
  Megaphone, 
  GraduationCap, 
  MessageSquare, 
  Users, 
  Zap, 
  CheckCircle2, 
  Building2, 
  FolderKanban,
  Search,
  Filter
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export const ECOSYSTEM_PROJECTS = [
  {
    id: 'aisa-core',
    layer: 'Layer 01 • Command Center',
    category: 'AI_CORE',
    name: 'AISA™ Core',
    tagline: 'Autonomous AI Super Assistant',
    desc: 'Unified intelligence layer with multi-session memory, multi-modal utility, intent-based agent routing, and autonomous cognitive execution.',
    badge: 'Interface Layer',
    status: 'LIVE / STABLE',
    logo: '/about-uwo/aisa-logo.png',
    accent: 'from-rose-500/20 to-orange-500/20 text-rose-500 border-rose-500/30',
    glow: 'hover:border-rose-500/50 hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]',
    url: 'https://aisa24.com',
    highlights: ['Multi-Session Memory', 'Intent Routing Engine', 'Agentic Execution']
  },
  {
    id: 'ai-mall',
    layer: 'Layer 02 • Discovery & Marketplace',
    category: 'COMMERCE',
    name: 'AI Mall™',
    tagline: 'Enterprise AI Tools Marketplace',
    desc: 'Curated enterprise AI marketplace and application registry that reduces custom solution evaluation and deployment cycles to minutes.',
    badge: 'App Ecosystem',
    status: 'LIVE MARKETPLACE',
    logo: '/about-uwo/aimall.png',
    accent: 'from-cyan-500/20 to-teal-500/20 text-cyan-500 border-cyan-500/30',
    glow: 'hover:border-cyan-500/50 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]',
    url: 'https://aimall24.com',
    highlights: ['Verified SaaS Connectors', '1-Click Deployment', 'SLA Monitoring']
  },
  {
    id: 'ai-legal',
    layer: 'Layer 03 • Sovereign Vertical OS',
    category: 'ENTERPRISE',
    name: 'AI LEGAL™',
    tagline: 'Sovereign Legal Intelligence OS',
    desc: 'Precision-grounded in 75+ years of Indian jurisprudence with zero hallucination, Sec 65B electronic evidence hashing, and court-ready drafting.',
    badge: 'Legal Tech OS',
    status: 'ENTERPRISE VERIFIED',
    logo: '/about-uwo/ailegal.png',
    accent: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30',
    glow: 'hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]',
    url: 'https://ailegal.aisa24.com',
    highlights: ['75+ Years Case Law', 'Sec 65B Hash Audits', 'Automated Briefs']
  },
  {
    id: 'ai-education',
    layer: 'Layer 04 • Adaptive Learning',
    category: 'AI_CORE',
    name: 'AI Education Ecosystem™',
    tagline: 'Cognitive Personalized Learning OS',
    desc: 'Adaptive neural learning companion providing real-time cognitive assessment, customized curriculum pacing, and continuous skill evaluation.',
    badge: 'EdTech Kernel',
    status: 'GLOBAL DEPLOYMENT',
    logo: '/about-uwo/aisa-logo.png',
    accent: 'from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/30',
    glow: 'hover:border-amber-500/50 hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]',
    url: 'https://education.uwo24.com',
    highlights: ['Cognitive Tracking', 'Neural Tutors', 'Instant Knowledge Testing']
  },
  {
    id: 'uwo-connect',
    layer: 'Layer 05 • Omnichannel Infrastructure',
    category: 'ENTERPRISE',
    name: 'UWO Connect™',
    tagline: 'Enterprise Multi-Channel AI Kernel',
    desc: 'Natively connects WhatsApp Cloud API, Instagram, Gmail, and voice agents directly into unified CRMs, team workspaces, and autonomous bots.',
    badge: 'Omnichannel SaaS',
    status: 'YOU ARE HERE',
    logo: '/about-uwo/uwoconnect.png',
    accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30',
    glow: 'hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]',
    url: 'https://uwoconnect.aisa24.com',
    highlights: ['WhatsApp Official API', 'Visual Builder', 'Multi-Lingual AI Bot']
  },
  {
    id: 'efv-framework',
    layer: 'Layer 06 • Human Operating System',
    category: 'HUMAN_OS',
    name: 'EFV™ Framework',
    tagline: 'Energy, Frequency & Vibration',
    desc: '9-level consciousness and workforce execution discipline authored by Gurumukh P. Ahuja across 175 countries, aligning human and AI energy.',
    badge: 'Human Readiness',
    status: 'PHILOSOPHY & PROTOCOL',
    logo: '/about-uwo/efv.png',
    accent: 'from-pink-500/20 to-rose-500/20 text-pink-500 border-pink-500/30',
    glow: 'hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]',
    url: 'https://efvframework.com/',
    highlights: ['175 Countries Active', 'Consciousness Matrix', 'Execution Discipline']
  }
];

export default function OurProjectsPage() {
  const { isDark } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProjects = ECOSYSTEM_PROJECTS.filter((proj) => {
    const matchesCategory = selectedCategory === 'ALL' || proj.category === selectedCategory;
    const matchesQuery = 
      proj.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      proj.layer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
        
        {/* ── Top Hero Banner ── */}
        <div className={cn(
          "relative overflow-hidden rounded-3xl p-6 sm:p-8 lg:p-10 border transition-all shadow-xl",
          isDark 
            ? "bg-gradient-to-br from-slate-900/90 via-[#0B1528]/80 to-slate-950 border-slate-800" 
            : "bg-gradient-to-br from-emerald-50/70 via-white to-teal-50/50 border-emerald-100/80 shadow-emerald-500/5"
        )}>
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border border-emerald-500/30 bg-emerald-500/10 text-[#059669] dark:text-emerald-400">
                <Sparkles size={13} className="animate-pulse" />
                <span>The Sovereign Ecosystem</span>
              </div>
              <h1 className={cn("text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight", isDark ? "text-white" : "text-slate-900")}>
                Our Projects & Platforms
              </h1>
              <p className={cn("text-xs sm:text-sm font-medium leading-relaxed", isDark ? "text-slate-300" : "text-slate-600")}>
                Explore the connected intelligence architecture of UWO & AISA. From vertical legal operating systems and multi-modal assistants to global omnichannel automation kernels and workforce frameworks.
              </p>
            </div>

            {/* Quick Link to Internal Team Projects */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
              <Link
                href="/client/team"
                className={cn(
                  "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border",
                  isDark 
                    ? "bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border-slate-700 shadow-sm" 
                    : "bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs"
                )}
              >
                <FolderKanban size={15} className="text-emerald-500" />
                <span>Team Workspace Projects</span>
              </Link>

              <a
                href="https://uwo24.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 hover:scale-[1.02]"
              >
                <Globe size={15} />
                <span>UWO24.com Portal</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>

        {/* ── Filters & Search Bar ── */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'ALL', label: 'All Projects', icon: Layers },
              { id: 'AI_CORE', label: 'AI & Intelligence', icon: Cpu },
              { id: 'ENTERPRISE', label: 'Enterprise & Legal', icon: Building2 },
              { id: 'COMMERCE', label: 'Marketplace & Growth', icon: ShoppingBag },
              { id: 'HUMAN_OS', label: 'Human OS', icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer",
                    isActive
                      ? (isDark ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40" : "bg-emerald-50 text-[#059669] border border-emerald-200 font-black")
                      : (isDark ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100")
                  )}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search size={14} className={cn("absolute left-3 top-1/2 -translate-y-1/2", isDark ? "text-slate-500" : "text-slate-400")} />
            <input
              type="text"
              placeholder="Search projects by name or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={cn(
                "w-full pl-9 pr-3 py-2 rounded-xl text-xs font-medium border transition-colors outline-hidden",
                isDark 
                  ? "bg-slate-900/60 border-slate-800 text-white placeholder-slate-500 focus:border-emerald-500/60" 
                  : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500/60 shadow-2xs"
              )}
            />
          </div>
        </div>

        {/* ── Project Cards Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className={cn(
                "group relative p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between hover:-translate-y-1",
                isDark ? "bg-slate-900/60 border-slate-800/80" : "bg-white border-slate-200/90 shadow-xs hover:shadow-lg",
                proj.glow
              )}
            >
              <div className="space-y-4">
                {/* Top Badge & Logo */}
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md border bg-gradient-to-r",
                    proj.accent
                  )}>
                    {proj.badge}
                  </span>

                  <span className={cn(
                    "text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider",
                    proj.status.includes('YOU') 
                      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/30"
                      : (isDark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-600")
                  )}>
                    {proj.status}
                  </span>
                </div>

                {/* Layer Title & Name */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-0.5">
                    {proj.layer}
                  </span>
                  <h3 className={cn("text-lg font-black tracking-tight", isDark ? "text-white" : "text-slate-950")}>
                    {proj.name}
                  </h3>
                  <p className="text-xs font-bold text-[#059669] dark:text-emerald-400 mt-0.5">
                    {proj.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className={cn("text-xs leading-relaxed font-medium", isDark ? "text-slate-300" : "text-slate-600")}>
                  {proj.desc}
                </p>

                {/* Highlights tags */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {proj.highlights.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={cn(
                        "text-[10px] font-medium px-2 py-0.5 rounded-md",
                        isDark ? "bg-slate-800/60 text-slate-300 border border-slate-700/50" : "bg-slate-100 text-slate-700"
                      )}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className={cn(
                "pt-4 mt-6 border-t flex items-center justify-between",
                isDark ? "border-slate-800" : "border-slate-100"
              )}>
                <span className="text-[11px] font-semibold text-slate-400">
                  Platform Portal
                </span>

                <a
                  href={proj.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#0B8F78] to-[#047857] hover:from-[#097562] hover:to-[#035941] transition-all shadow-xs group-hover:shadow-sm"
                >
                  <span>Launch</span>
                  <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom Callout: Workspace Internal Projects ── */}
        <div className={cn(
          "rounded-2xl p-6 border flex flex-col md:flex-row items-center justify-between gap-4",
          isDark ? "bg-slate-900/40 border-slate-800" : "bg-slate-50/80 border-slate-200"
        )}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <FolderKanban size={20} />
            </div>
            <div>
              <h4 className={cn("text-sm font-bold", isDark ? "text-white" : "text-slate-900")}>
                Looking for Internal Client & Team Projects?
              </h4>
              <p className={cn("text-xs font-medium", isDark ? "text-slate-400" : "text-slate-600")}>
                Assign team members, track Kanban tasks, milestone progress, and client deliverables from your Team Hub.
              </p>
            </div>
          </div>

          <Link
            href="/client/team"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 transition-colors whitespace-nowrap shadow-xs"
          >
            Open Team Projects
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}

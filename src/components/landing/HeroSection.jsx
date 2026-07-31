'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, MessageSquare, Database, Users, TrendingUp, Layers, Mail, Activity, ArrowRight, Zap, CheckCircle2, Globe, Shield } from 'lucide-react';

export default function HeroSection({ isDark = true }) {
  return (
    <section className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-20 md:pt-28 md:pb-28 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 min-h-screen">
      {/* Background Ambient Glow Orbs */}
      <div className="absolute top-[15%] left-[5%] w-[500px] h-[500px] bg-[#10B981]/15 rounded-full blur-[140px] pointer-events-none animate-slow-glow" />
      <div className="absolute bottom-[10%] right-[5%] w-[450px] h-[450px] bg-[#20C997]/15 rounded-full blur-[120px] pointer-events-none animate-slow-glow [animation-delay:3s]" />

      {/* Left Column: Value Proposition */}
      <div className="flex-1 text-center lg:text-left max-w-2xl relative z-10 animate-fade-in-up">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg text-[10px] uppercase tracking-widest font-bold text-[#20C997] mb-8 backdrop-blur-md ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-[#059669]/5 border-[#059669]/20'
          }`}
        >
          <Sparkles size={14} className="animate-spin [animation-duration:8s]" />
          <span>Omnichannel • 24/7 AI Agents • Workflow Automation • Enterprise SaaS</span>
        </div>

        {/* Hero Title */}
        <h1
          className={`text-5xl md:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}
        >
          One Platform. <br />
          <span className={`bg-gradient-to-r bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(16,185,129,0.3)] ${
            isDark ? 'from-white via-[#10B981] to-teal-300' : 'from-slate-900 via-[#10B981] to-teal-600'
          }`}>
            Endless Connections.
          </span>
        </h1>

        {/* Narrative Definition */}
        <p
          className={`text-lg md:text-xl font-medium leading-relaxed mb-6 max-w-xl mx-auto lg:mx-0 ${
            isDark ? 'text-slate-300' : 'text-slate-700'
          }`}
        >
          UWO Connect unifies WhatsApp Business API, Instagram Direct, Facebook Messenger, Email, and Web Chat into one intelligent AI automation workspace.
        </p>

        <p
          className={`text-sm md:text-base font-normal leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0 ${
            isDark ? 'text-[#8E99A8]' : 'text-slate-600'
          }`}
        >
          Never lose another customer inquiry. Automate lead qualification, schedule appointments, and empower your agents with RAG AI assistants that work round the clock.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold rounded-2xl text-xs uppercase tracking-wider shadow-[0_0_25px_rgba(16,185,129,0.4)] hover:shadow-[0_0_35px_rgba(16,185,129,0.6)] transition-all duration-300 flex items-center gap-2 cursor-pointer"
          >
            Start Free Trial
            <ArrowRight size={16} />
          </Link>
          <a
            href="#pricing"
            className={`px-8 py-4 border font-bold rounded-2xl text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer ${
              isDark ? 'bg-white/5 border-white/10 text-white hover:bg-white/10' : 'bg-slate-900/5 border-slate-900/10 text-slate-900 hover:bg-slate-900/10'
            }`}
          >
            Explore Pricing
          </a>
        </div>

        {/* Key Live Metrics Bar */}
        <div className={`pt-6 border-t grid grid-cols-3 gap-4 text-left max-w-lg mx-auto lg:mx-0 ${isDark ? 'border-white/10' : 'border-slate-900/10'}`}>
          <div>
            <div className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>+340%</div>
            <div className="text-[10px] font-semibold text-[#8E99A8] uppercase tracking-wider">Lead Conversion</div>
          </div>
          <div>
            <div className="text-2xl font-extrabold text-[#10B981]">&lt; 2 Sec</div>
            <div className="text-[10px] font-semibold text-[#8E99A8] uppercase tracking-wider">AI Response Time</div>
          </div>
          <div>
            <div className={`text-2xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>99.99%</div>
            <div className="text-[10px] font-semibold text-[#8E99A8] uppercase tracking-wider">Uptime SLA</div>
          </div>
        </div>
      </div>

      {/* Right Column: Connection Hub Graphic */}
      <div className="flex-1 w-full max-w-[640px] relative z-10">
        <div
          className={`rounded-[32px] p-6 md:p-8 shadow-2xl relative overflow-hidden border backdrop-blur-xl ${
            isDark ? 'bg-slate-950/60 border-white/10' : 'bg-white/80 border-[#059669]/15'
          }`}
        >
          {/* Hub Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
              </div>
              <span className="text-xs font-bold text-slate-300 font-mono">uwo-connect.hub</span>
            </div>
            <span className="px-3 py-1 bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" /> Live Connection Kernel
            </span>
          </div>

          {/* Connection Hub Visualization Grid */}
          <div className="relative p-6 rounded-2xl bg-slate-900/80 border border-white/10 overflow-hidden mb-6">
            {/* Central Node: UWO Connect AI Core */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#10B981] to-[#059669] mx-auto flex flex-col items-center justify-center text-black font-black shadow-[0_0_40px_rgba(16,185,129,0.5)] z-20 relative animate-pulse">
              <Sparkles size={24} />
              <span className="text-[10px] uppercase font-black tracking-widest mt-1">UWO AI</span>
            </div>

            {/* Orbiting Channel Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 relative z-20">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-[#25D366] transition-colors">
                <MessageSquare size={16} className="text-[#25D366] mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">WhatsApp</span>
                <span className="text-[8px] text-emerald-400">Meta API</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-pink-500 transition-colors">
                <Globe size={16} className="text-pink-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">Instagram</span>
                <span className="text-[8px] text-pink-400">Direct Messages</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-red-400 transition-colors">
                <Mail size={16} className="text-red-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">Email SMTP</span>
                <span className="text-[8px] text-red-400">Smart Inbox</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center hover:border-blue-400 transition-colors">
                <Database size={16} className="text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] font-bold text-white block">Web Chat</span>
                <span className="text-[8px] text-blue-400">RAG Vector AI</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#10B981]" />
              <span>256-Bit SSL Encrypted & PCI-DSS Compliant</span>
            </div>
            <span className="text-[#10B981] font-bold">Connected</span>
          </div>
        </div>
      </div>
    </section>
  );
}

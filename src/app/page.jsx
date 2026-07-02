'use client';

import React from 'react';
import HeroSection from '@/components/landing/HeroSection';
import TrustedBy from '@/components/landing/TrustedBy';
import WhyEFV from '@/components/landing/WhyEFV';
import PlatformModules from '@/components/landing/PlatformModules';
import AutomationShowcase from '@/components/landing/AutomationShowcase';
import DashboardPreview from '@/components/landing/DashboardPreview';
import Integrations from '@/components/landing/Integrations';
import AIAssistant from '@/components/landing/AIAssistant';
import FeatureComparison from '@/components/landing/FeatureComparison';
import WorkflowTimeline from '@/components/landing/WorkflowTimeline';
import Testimonials from '@/components/landing/Testimonials';
import Pricing from '@/components/landing/Pricing';
import FAQ from '@/components/landing/FAQ';
import CTABanner from '@/components/landing/CTABanner';
import Footer from '@/components/landing/Footer';
import Link from 'next/link';
import { Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans overflow-x-hidden relative selection:bg-[#16A085]/20 selection:text-[#20C997]">
      
      {/* BACKGROUND ELEMENTS */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 grid-pattern opacity-50" />
      </div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full glass-navbar">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F6B52] to-[#16A085] flex items-center justify-center border border-white/10 shadow-[0_0_15px_rgba(22,160,133,0.3)] group-hover:shadow-[0_0_25px_rgba(32,201,151,0.5)] transition-all">
              <Sparkles className="text-white" size={16} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              EFV Unified
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-widest text-[#8E99A8]">
            <Link href="#platform" className="hover:text-white transition-colors">Platform</Link>
            <Link href="#automations" className="hover:text-white transition-colors">Automations</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/auth/login" className="text-xs font-bold uppercase tracking-widest text-[#8E99A8] hover:text-white transition-colors">
              Login
            </Link>
            <Link href="/auth/login" className="px-6 py-2.5 bg-[#16A085] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_15px_rgba(22,160,133,0.2)] hover:shadow-[0_4px_25px_rgba(22,160,133,0.4)] hover:-translate-y-0.5 transition-all">
              Start Free
            </Link>
          </div>

          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* MAIN SECTIONS */}
      <main className="relative z-10">
        <HeroSection />
        <TrustedBy />
        <WhyEFV />
        <PlatformModules />
        <AutomationShowcase />
        <DashboardPreview />
        <Integrations />
        <AIAssistant />
        <FeatureComparison />
        <WorkflowTimeline />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTABanner />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

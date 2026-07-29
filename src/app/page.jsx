'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, X, Sun, Moon, Sparkles } from 'lucide-react';
// Above-the-fold — load eagerly
import HeroSection from '@/components/landing/HeroSection';

// Below-the-fold — lazy load for fast initial page render
const TrustedBy = dynamic(() => import('@/components/landing/TrustedBy'));
const BeforeAfterSection = dynamic(() => import('@/components/landing/BeforeAfterSection'));
const DailyImpactSection = dynamic(() => import('@/components/landing/DailyImpactSection'));
const WhyEFV = dynamic(() => import('@/components/landing/WhyEFV'));
const PlatformModules = dynamic(() => import('@/components/landing/PlatformModules'));
const AutomationShowcase = dynamic(() => import('@/components/landing/AutomationShowcase'));
const DashboardPreview = dynamic(() => import('@/components/landing/DashboardPreview'));
const AIAssistant = dynamic(() => import('@/components/landing/AIAssistant'));
const FeatureComparison = dynamic(() => import('@/components/landing/FeatureComparison'));
const WorkflowTimeline = dynamic(() => import('@/components/landing/WorkflowTimeline'));
const Testimonials = dynamic(() => import('@/components/landing/Testimonials'));
const Pricing = dynamic(() => import('@/components/landing/Pricing'));
const FAQ = dynamic(() => import('@/components/landing/FAQ'));
const CTABanner = dynamic(() => import('@/components/landing/CTABanner'));
const Footer = dynamic(() => import('@/components/landing/Footer'));

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [activeSection, setActiveSection] = useState('hero');

  const navItems = [
    { name: 'Platform', id: 'platform' },
    { name: 'Transformation', id: 'transformation' },
    { name: 'Impact', id: 'impact' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const sections = ['platform', 'transformation', 'impact', 'pricing', 'contact'];

    const handleScroll = () => {
      const scrollPos = window.scrollY + 120; // Offset for scroll trigger point

      // Set to hero/top if close to the start
      if (window.scrollY < 100) {
        setActiveSection('hero');
        return;
      }

      // Check which section is in view
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            return;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const offset = 80; // height of sticky navbar
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  return (
    <div className={`min-h-screen font-sans overflow-x-hidden relative selection:bg-[#10B981]/30 selection:text-white transition-colors duration-500 ${isDark ? 'bg-[#030712] text-white' : 'light bg-[#F3FBF7] text-[#000000]'}`}>

      {/* Global Ambient Background Gradients for Dark Mode */}
      {isDark && (
        <>
          <div className="fixed top-0 left-1/4 w-[800px] h-[800px] bg-[#10B981]/10 rounded-full blur-[140px] pointer-events-none -translate-y-1/2 z-0" />
          <div className="fixed bottom-0 right-1/4 w-[600px] h-[600px] bg-[#059669]/10 rounded-full blur-[120px] pointer-events-none translate-y-1/3 z-0" />
        </>
      )}

      {/* HEADER */}
      <header className={`sticky top-0 z-50 w-full backdrop-blur-[16px] saturate-[180%] border-b transition-colors duration-500 ${isDark
          ? 'bg-[#030712]/75 border-white/[0.06] text-white'
          : 'bg-[#F3FBF7]/75 border-[#10B981]/15 text-[#000000]'
        }`}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center text-black font-black shadow-[0_0_20px_rgba(16,185,129,0.4)] group-hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transition-all">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">UWO Connect</span>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`text-xs font-bold uppercase tracking-wider transition-colors hover:text-[#10B981] ${
                  activeSection === item.id ? 'text-[#10B981]' : isDark ? 'text-slate-300' : 'text-slate-700'
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/auth/login"
              className="text-xs font-bold uppercase tracking-wider text-slate-300 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/auth/register"
              className="px-6 py-2.5 bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all"
            >
              Start Free
            </Link>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0B0D11] border-b border-white/10 p-6 space-y-4">
            <div className="flex flex-col gap-3">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    handleNavClick(e, item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm font-bold text-slate-300 hover:text-[#10B981]"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <Link
                href="/auth/login"
                className="w-full py-3 text-center text-xs font-bold text-white bg-white/5 border border-white/10 rounded-xl"
              >
                Login
              </Link>
              <Link
                href="/auth/register"
                className="w-full py-3 text-center text-xs font-bold text-white bg-[#10B981] rounded-xl"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* MAIN SECTIONS */}
      <main className="relative z-10">
        <HeroSection isDark={isDark} />
        <TrustedBy isDark={isDark} />
        
        <div id="transformation">
          <BeforeAfterSection isDark={isDark} />
        </div>

        <div id="impact">
          <DailyImpactSection isDark={isDark} />
        </div>

        <WhyEFV isDark={isDark} />
        
        <div id="platform">
          <PlatformModules isDark={isDark} />
        </div>
        
        <AutomationShowcase isDark={isDark} />
        <DashboardPreview />
        <AIAssistant />
        
        <div id="documentation">
          <FeatureComparison />
        </div>
        
        <WorkflowTimeline />
        <Testimonials />
        
        <div id="pricing">
          <Pricing />
        </div>
        
        <div id="contact">
          <FAQ />
        </div>
        
        <CTABanner />
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

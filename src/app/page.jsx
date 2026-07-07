'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Menu, X, Sun, Moon } from 'lucide-react';
// Above-the-fold — load eagerly
import HeroSection from '@/components/landing/HeroSection';

// Below-the-fold — lazy load for fast initial page render
const TrustedBy = dynamic(() => import('@/components/landing/TrustedBy'));
const WhyEFV = dynamic(() => import('@/components/landing/WhyEFV'));
const PlatformModules = dynamic(() => import('@/components/landing/PlatformModules'));
const AutomationShowcase = dynamic(() => import('@/components/landing/AutomationShowcase'));
const DashboardPreview = dynamic(() => import('@/components/landing/DashboardPreview'));
const Integrations = dynamic(() => import('@/components/landing/Integrations'));
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
    { name: 'Integrations', id: 'integrations' },
    { name: 'Pricing', id: 'pricing' },
    { name: 'Documentation', id: 'documentation' },
    { name: 'Contact', id: 'contact' },
  ];

  useEffect(() => {
    const sections = ['platform', 'integrations', 'pricing', 'documentation', 'contact'];
    
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
      <header className={`sticky top-0 z-50 w-full backdrop-blur-[16px] saturate-[180%] border-b transition-colors duration-500 ${
        isDark 
          ? 'bg-[#030712]/75 border-white/[0.06] text-white' 
          : 'bg-[#F3FBF7]/75 border-[#10B981]/15 text-[#000000]'
      }`}>
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center shadow-[0_0_15px_rgba(5,150,105,0.3)] group-hover:shadow-[0_0_25px_rgba(5,150,105,0.5)] transition-all">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
            </div>
            <span className={`font-bold text-lg tracking-tight transition-colors duration-300 ${isDark ? 'text-white' : 'text-[#000000]'}`}>
              Meta Connect
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 bg-white/[0.03] dark:bg-white/[0.02] border border-white/[0.05] dark:border-white/[0.03] rounded-full px-2 py-1.5 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.name}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative px-4 py-1.5 text-sm font-medium transition-colors duration-300 rounded-full ${
                    isActive 
                      ? (isDark ? 'text-white' : 'text-white')
                      : (isDark ? 'text-[#8E99A8] hover:text-white' : 'text-[#059669] hover:text-[#000000]')
                  }`}
                >
                  {isActive && (
                    <div
                      className={`absolute inset-0 rounded-full -z-10 ${
                        isDark ? 'bg-white/[0.08]' : 'bg-[#059669]'
                      }`}
                    />
                  )}
                  {item.name}
                </a>
              );
            })}
          </nav>

          <div className="hidden md:flex items-center gap-4 shrink-0">
            <button 
              onClick={() => setIsDark(!isDark)}
              className={`p-2 transition-colors rounded-full ${
                isDark 
                  ? 'text-[#8E99A8] hover:text-white hover:bg-white/5' 
                  : 'text-[#059669] hover:text-[#000000] hover:bg-[#059669]/10'
              }`}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <Link 
              href="/auth/login" 
              className={`text-sm font-medium transition-colors px-4 py-2 ${
                isDark ? 'text-[#8E99A8] hover:text-white' : 'text-[#059669] hover:text-[#000000]'
              }`}
            >
              Login
            </Link>
            <Link 
              href="/auth/register" 
              className="px-6 py-2.5 bg-[#059669] text-white font-semibold text-sm rounded-full shadow-[0_0_20px_rgba(5,150,105,0.2)] hover:shadow-[0_0_30px_rgba(5,150,105,0.4)] hover:bg-[#047857] transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>

          <button 
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-[#059669]/10 text-[#059669]'
            }`} 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        
          {mobileMenuOpen && (
            <div
              className={`md:hidden border-t backdrop-blur-[24px] px-6 py-6 flex flex-col gap-4 overflow-hidden ${
                isDark 
                  ? 'bg-[#030712]/95 border-white/[0.06] text-white' 
                  : 'bg-[#F3FBF7]/95 border-[#10B981]/15 text-[#000000]'
              }`}
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <a 
                      key={item.name} 
                      href={`#${item.id}`} 
                      onClick={(e) => {
                        handleNavClick(e, item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive 
                          ? (isDark ? 'bg-white/10 text-white' : 'bg-[#059669]/10 text-[#059669]')
                          : (isDark ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-[#059669]/80 hover:text-[#000000] hover:bg-[#059669]/5')
                      }`}
                    >
                      {item.name}
                    </a>
                  );
                })}
              </div>
              <hr className={`my-2 ${isDark ? 'border-white/10' : 'border-[#059669]/15'}`} />
              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    setIsDark(!isDark);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full py-3 text-center text-sm font-semibold flex items-center justify-center gap-2 border rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5 text-slate-300' 
                      : 'border-[#059669]/20 hover:bg-[#059669]/5 text-[#059669]'
                  }`}
                >
                  {isDark ? <Sun size={18} /> : <Moon size={18} />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
                <Link 
                  href="/auth/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`w-full py-3 text-center text-sm font-semibold border rounded-xl transition-all duration-200 ${
                    isDark 
                      ? 'border-white/10 hover:bg-white/5 text-slate-300' 
                      : 'border-[#059669]/20 hover:bg-[#059669]/5 text-[#059669]'
                  }`}
                >
                  Login
                </Link>
                <Link 
                  href="/auth/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-3 text-center text-sm font-bold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-all hover:shadow-[0_0_20px_rgba(5,150,105,0.3)]"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          )}
        
      </header>

      {/* MAIN SECTIONS */}
      <main className="relative z-10">
        <HeroSection />
        <TrustedBy />
        <WhyEFV />
        <div id="platform">
          <PlatformModules />
        </div>
        <AutomationShowcase />
        <DashboardPreview />
        <div id="integrations">
          <Integrations />
        </div>
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



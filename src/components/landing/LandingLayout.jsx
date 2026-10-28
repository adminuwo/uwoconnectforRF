'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Sun, Moon, Menu, X, ArrowRight, ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBrand } from '@/context/BrandContext';
import UWOLoginModal from '@/components/UWOLoginModal';
import TermsModal from '@/components/TermsModal';
import {
  WhatsAppLogo, InstagramLogo, FacebookLogo, YouTubeLogo,
  GmailLogo, LinkedInLogo, XLogo, PinterestLogo,
  ThreadsLogo, RedditLogo, QuoraLogo, MediumLogo
} from './LandingBrandLogos';
import ProjectsDropdown, { MobileProjectsAccordion } from './ProjectsDropdown';

export default function LandingLayout({ children, activePage = '' }) {
  const router = useRouter();
  const pathname = usePathname();
  const { brand, isWhiteLabel } = useBrand();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      if (token && userStr) {
        setLoggedInUser(JSON.parse(userStr));
      } else {
        setLoggedInUser(null);
      }
    } catch (e) { }

    // Default to light mode unless explicitly set to dark
    try {
      const savedTheme = localStorage.getItem('uwo_landing_theme') || localStorage.getItem('uwo_theme');
      if (savedTheme === 'dark') {
        setIsDarkMode(true);
        document.documentElement.classList.add('dark');
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove('dark');
      }
    } catch (e) { }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    try {
      localStorage.setItem('uwo_landing_theme', newTheme ? 'dark' : 'light');
      localStorage.setItem('uwo_theme', newTheme ? 'dark' : 'light');
    } catch (e) { }
  };

  const handleDashboardRedirect = () => {
    if (loggedInUser?.role === 'superadmin' || loggedInUser?.role === 'admin') {
      router.push('/admin');
    } else {
      router.push('/client');
    }
  };

  const handleStartFree = () => {
    if (loggedInUser) {
      handleDashboardRedirect();
    } else {
      router.push('/auth/register');
    }
  };

  const brandName = isWhiteLabel && brand?.name ? brand.name : 'UWO Connect';
  const logoUrl = isWhiteLabel && brand?.logo_url ? brand.logo_url : '/favicon.png';

  const navLinks = [
    { label: 'Channels', href: '/channels', key: 'channels' },
    { label: 'Connectors', href: '/connectors', key: 'connectors' },
    { label: 'Automation', href: '/automation', key: 'automation' },
    { label: 'Features', href: '/features', key: 'features' },
    { label: 'How It Works', href: '/how-it-works', key: 'how-it-works' },
    { label: 'Pricing', href: '/pricing', key: 'pricing' },
    { label: 'About Us', href: '/about', key: 'about' },
    { label: 'Mobile App', href: '/mobile-app', key: 'mobile-app' },
  ];

  const checkIsActive = (linkKey, linkHref) => {
    if (activePage && activePage === linkKey) return true;
    if (pathname === linkHref) return true;
    if (pathname?.startsWith(linkHref) && linkHref !== '/') return true;
    return false;
  };

  return (
    <div className={cn(
      "min-h-screen font-sans landing-page-root selection:bg-[#0B8F78]/20 selection:text-[#0B8F78] transition-colors duration-300 pt-16",
      isDarkMode ? "dark bg-[#070B14] text-slate-100" : "bg-[#F8FAFC] text-slate-900"
    )}>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* FIXED GLASSY NAVBAR                                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <header
        className={cn(
          "fixed top-0 left-0 right-0 w-full z-50 backdrop-blur-xl border-b transition-all duration-300",
          isDarkMode
            ? "bg-[#070B14]/90 border-slate-800/80 text-slate-100"
            : "bg-white/90 border-slate-200/80 text-slate-900 shadow-xs"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group cursor-pointer">
            <img
              src={logoUrl}
              alt={brandName}
              width={34}
              height={34}
              className="w-8.5 h-8.5 object-contain group-hover:scale-105 transition-transform duration-200 shrink-0"
            />
            <div className="text-left">
              <span className={cn(
                "text-lg font-black tracking-tight leading-none block group-hover:text-[#0B8F78] transition-colors",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                {brandName}
              </span>
              <span className="text-[10px] font-bold tracking-widest text-[#0B8F78] uppercase block leading-none">
                AI MULTI-CHANNEL SAAS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1.5 text-xs font-semibold">
            {navLinks.map((link) => {
              const active = checkIsActive(link.key, link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={cn(
                    "px-3 py-1.5 rounded-lg transition-colors",
                    active
                      ? (isDarkMode ? "text-[#0B8F78] bg-emerald-950/60 font-bold shadow-xs" : "text-[#0B8F78] bg-emerald-50 font-bold shadow-xs")
                      : (isDarkMode ? "text-slate-200 hover:text-white hover:bg-slate-800/60" : "text-slate-700 hover:text-slate-900 hover:bg-slate-100")
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* All Projects & Ecosystem Dropdown */}
            <ProjectsDropdown isDarkMode={isDarkMode} align="right" />
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center",
                isDarkMode
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-800"
                  : "bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200"
              )}
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Platform / Login Trigger */}
            {loggedInUser ? (
              <button
                type="button"
                onClick={handleDashboardRedirect}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-xs font-bold shadow-md shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <span>Dashboard</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/auth/login')}
                  className={cn(
                    "hidden sm:inline-flex px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer",
                    isDarkMode ? "text-slate-300 hover:text-white" : "text-slate-700 hover:text-slate-900"
                  )}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={handleStartFree}
                  className="hidden sm:inline-flex px-4 py-2 rounded-xl bg-[#0B8F78] hover:bg-[#097361] text-white text-xs font-bold shadow-md shadow-emerald-700/25 hover:scale-105 active:scale-95 transition-all cursor-pointer items-center gap-1.5"
                >
                  <span>Start Free</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={cn(
                "lg:hidden p-2 rounded-xl border",
                isDarkMode ? "border-slate-800 text-slate-300" : "border-slate-200 text-slate-700"
              )}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className={cn(
            "lg:hidden border-t px-6 py-5 space-y-3 transition-all",
            isDarkMode ? "bg-[#070B14] border-slate-800" : "bg-white border-slate-200 shadow-md"
          )}>
            {navLinks.map((link) => {
              const active = checkIsActive(link.key, link.href);
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block text-sm py-1.5 transition-colors",
                    active
                      ? "text-[#0B8F78] font-bold"
                      : (isDarkMode ? "text-slate-300 font-semibold" : "text-slate-700 font-semibold")
                  )}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Mobile Projects & Ecosystem List */}
            <MobileProjectsAccordion
              isDarkMode={isDarkMode}
              onItemClick={() => setMobileMenuOpen(false)}
            />

            <div className={cn("pt-2 border-t flex items-center gap-3", isDarkMode ? "border-slate-800" : "border-slate-200")}>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); router.push('/auth/login'); }}
                className={cn(
                  "w-1/2 py-2 rounded-xl border text-xs font-bold",
                  isDarkMode ? "border-slate-700 text-slate-200" : "border-slate-200 text-slate-800 bg-slate-50"
                )}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => { setMobileMenuOpen(false); handleStartFree(); }}
                className="w-1/2 py-2 rounded-xl bg-[#0B8F78] text-white text-xs font-bold"
              >
                Start Free
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main>
        {typeof children === 'function' ? children({ isDarkMode }) : React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            // Avoid passing custom props to native DOM elements (div, section, etc.)
            if (typeof child.type === 'string') {
              return child;
            }
            return React.cloneElement(child, { isDarkMode });
          }
          return child;
        })}
      </main>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* COMPREHENSIVE FOOTER                                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <footer
        className={cn(
          "border-t py-16 px-4 sm:px-6 lg:px-8 transition-colors text-xs font-medium",
          isDarkMode ? "bg-[#05080F] border-slate-800 text-slate-400" : "bg-slate-50 border-slate-200 text-slate-600"
        )}
      >
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 items-start">

          {/* Column 1: Brand Info */}
          <div className="space-y-4 md:col-span-1 text-center md:text-left">
            <Link href="/" className="flex items-center justify-center md:justify-start gap-2.5">
              <img
                src="/favicon.png"
                alt="UWO Connect"
                width={28}
                height={28}
                className="w-7 h-7 object-contain filter brightness-110 shrink-0"
              />
              <span className={cn("text-base font-extrabold", isDarkMode ? "text-white" : "text-slate-900")}>
                {brandName}
              </span>
            </Link>
            <p className={cn("text-xs leading-relaxed", isDarkMode ? "text-slate-400" : "text-slate-600")}>
              Unified Communication &amp; Business Automation Platform. Connect channels, tools, and workflows seamlessly.
            </p>
            <div className="text-xs">
              <span>Support &amp; Operations: </span>
              <a href="mailto:connect@uwo24.com" className="font-bold text-[#0B8F78] hover:underline">
                connect@uwo24.com
              </a>
            </div>
          </div>

          {/* Column 2: Company Links */}
          <div className="space-y-3 text-center md:text-left">
            <h5 className={cn("font-bold text-xs uppercase tracking-wider", isDarkMode ? "text-white" : "text-slate-900")}>
              Company
            </h5>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-[#0B8F78] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#0B8F78] transition-colors">Contact</Link></li>
              <li><Link href="/book" className="hover:text-[#0B8F78] transition-colors">Book Demo</Link></li>
              <li><Link href="/#white-label" className="hover:text-[#0B8F78] transition-colors">White Label</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal Links */}
          <div className="space-y-3 text-center md:text-left">
            <h5 className={cn("font-bold text-xs uppercase tracking-wider", isDarkMode ? "text-white" : "text-slate-900")}>
              Legal
            </h5>
            <ul className="space-y-2">
              <li><Link href="/terms-and-conditions" className="hover:text-[#0B8F78] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#0B8F78] transition-colors">Privacy Policy</Link></li>
              <li><Link href="/cookie-policy" className="hover:text-[#0B8F78] transition-colors">Cookie Policy</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => typeof window !== 'undefined' && window.dispatchEvent(new CustomEvent('open_cookie_settings'))}
                  className="hover:text-[#0B8F78] transition-colors cursor-pointer"
                >
                  Cookie Settings
                </button>
              </li>
              <li><Link href="/refund-policy" className="hover:text-[#0B8F78] transition-colors">Refund Policy</Link></li>
            </ul>
          </div>

          {/* Column 4: Social Network Links */}
          <div className="space-y-3 text-center md:text-left">
            <h5 className={cn("font-bold text-xs uppercase tracking-wider", isDarkMode ? "text-white" : "text-slate-900")}>
              Connect With Us
            </h5>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
              {[
                { href: "https://www.instagram.com/uwoconnect", title: "Instagram", icon: <InstagramLogo size={16} /> },
                { href: "https://www.linkedin.com/in/ai-legal%E2%84%A2-094564439/", title: "LinkedIn", icon: <LinkedInLogo size={16} /> },
                { href: "https://x.com/uwoconnect", title: "X (Twitter)", icon: <XLogo size={16} /> },
                { href: "https://www.youtube.com/@UWOConnect", title: "YouTube", icon: <YouTubeLogo size={16} /> },
                { href: "https://in.pinterest.com/aimallglobal/", title: "Pinterest", icon: <PinterestLogo size={16} /> },
                { href: "https://www.facebook.com/aimallglobal/", title: "Facebook", icon: <FacebookLogo size={16} /> },
                { href: "https://api.whatsapp.com/send?phone=918359890909", title: "WhatsApp", icon: <WhatsAppLogo size={16} /> },
                { href: "mailto:connect@uwo24.com", title: "Email", icon: <GmailLogo size={16} /> },
                { href: "https://www.threads.net/@aimallglobal", title: "Threads", icon: <ThreadsLogo size={16} /> },
                { href: "https://www.reddit.com/settings/profile/#visibility", title: "Reddit", icon: <RedditLogo size={16} /> },
                { href: "https://www.quora.com/profile/Aimallglobal", title: "Quora", icon: <QuoraLogo size={16} /> },
                { href: "https://medium.com/@03sonalijain", title: "Medium", icon: <MediumLogo size={16} /> },
              ].map((s, idx) => (
                <a
                  key={idx}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  className={cn(
                    "p-2 rounded-xl border hover:scale-110 hover:border-emerald-500 transition-all cursor-pointer",
                    isDarkMode ? "bg-slate-900 border-slate-700 text-slate-300" : "bg-white border-slate-200 text-slate-700 shadow-xs"
                  )}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className={cn(
          "max-w-7xl mx-auto pt-8 mt-8 border-t flex flex-col items-center justify-center text-center gap-2 text-[11px]",
          isDarkMode ? "border-slate-800/80 text-slate-400" : "border-slate-200 text-slate-600"
        )}>
          <div>
            © 2026 UWO Connect. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-slate-500">
            <span>Server Status: <strong className="text-emerald-500">100% Operational</strong></span>
            <span>•</span>
            <span>Security: <strong>Enterprise 256-bit TLS</strong></span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <UWOLoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
      <TermsModal isOpen={isTermsModalOpen} onClose={() => setIsTermsModalOpen(false)} />

    </div>
  );
}

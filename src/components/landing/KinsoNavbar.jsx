'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowRight } from 'lucide-react';

export default function KinsoNavbar({ isDark, setIsDark }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Product', href: '#product' },
    { name: 'Features', href: '#features' },
    { name: 'Connectors', href: '#connectors' },
    { name: 'Automation', href: '#automation' },
    { name: 'Security', href: '#security' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <header
      className={`sticky top-0 z-50 w-full backdrop-blur-xl transition-colors duration-300 border-b ${
        isDark
          ? 'bg-[#090D16]/90 border-white/10 text-white'
          : 'bg-[#F0FDF4]/90 border-[#00AB56]/15 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-[#00AB56]/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white p-0.5 border border-[#00AB56]/20 shrink-0">
            <img
              src="/download (3).gif"
              alt="UWO Connect Logo"
              className="w-full h-full object-cover rounded-lg"
              width={40}
              height={40}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg tracking-tight leading-none">
              UWO <span className="text-[#00AB56]">Connect</span>
            </span>
            <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-gray-400 font-semibold mt-0.5">
              AI Workspace
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-[#00AB56] ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Desktop Right CTAs */}
        <div className="hidden lg:flex items-center gap-3.5">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-all cursor-pointer ${
              isDark
                ? 'border-white/10 text-gray-300 hover:text-white hover:bg-white/5'
                : 'border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
            title="Toggle Theme"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/auth/login"
            className={`text-sm font-medium px-4 py-2 rounded-xl transition-colors ${
              isDark
                ? 'text-gray-300 hover:text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Log in
          </Link>

          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#00AB56] to-[#00AE8B] hover:from-[#008989] hover:to-[#00AB56] text-white px-5 py-2.5 rounded-xl font-medium text-sm shadow-sm hover:shadow-md hover:shadow-[#00AB56]/20 transition-all duration-200"
          >
            Start Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
            }`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
            }`}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`lg:hidden border-b px-5 py-5 space-y-4 shadow-xl ${
            isDark ? 'bg-[#090D16] border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-sm font-semibold py-2.5 px-3 rounded-lg transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:text-white hover:bg-white/5'
                    : 'text-gray-700 hover:text-[#00AB56] hover:bg-gray-50'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-gray-200 dark:border-white/10 flex flex-col gap-2.5">
            <Link
              href="/auth/login"
              onClick={() => setMobileMenuOpen(false)}
              className={`w-full py-2.5 text-center text-sm font-semibold rounded-xl border ${
                isDark ? 'border-white/10 text-white hover:bg-white/5' : 'border-gray-200 text-gray-900 hover:bg-gray-50'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-3 text-center text-sm font-semibold text-white bg-gradient-to-r from-[#00AB56] to-[#00AE8B] rounded-xl shadow-md shadow-[#00AB56]/20 flex items-center justify-center gap-2"
            >
              <span>Start Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

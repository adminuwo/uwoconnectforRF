'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Sun, Moon, ArrowRight, Sparkles } from 'lucide-react';

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
          ? 'bg-[#090D16]/80 border-white/10 text-white'
          : 'bg-[#F0FDF4]/85 border-[#00AB56]/15 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md shadow-[#00AB56]/20 group-hover:scale-105 transition-transform duration-300 flex items-center justify-center bg-white p-0.5 border border-[#00AB56]/20">
            <img
              src="/download (3).gif"
              alt="UWO Connect Logo"
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight leading-none">
              UWO <span className="text-[#00AB56]">Connect</span>
            </span>
            <span className="text-[10px] tracking-widest uppercase text-gray-400 font-semibold mt-0.5">
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
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border transition-all ${
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
        <div className="flex lg:hidden items-center gap-3">
          <button
            onClick={() => setIsDark(!isDark)}
            className={`p-2 rounded-xl border ${
              isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-xl border ${
              isDark ? 'border-white/10 text-gray-300' : 'border-gray-200 text-gray-600'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`lg:hidden border-b px-6 py-6 space-y-4 ${
            isDark ? 'bg-[#090D16] border-white/10' : 'bg-white border-gray-200'
          }`}
        >
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-medium py-1.5 transition-colors ${
                  isDark ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-[#16A34A]'
                }`}
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-white/10 flex flex-col gap-3">
            <Link
              href="/auth/login"
              className={`w-full py-2.5 text-center font-medium rounded-xl border ${
                isDark ? 'border-white/10 text-white' : 'border-gray-200 text-gray-900'
              }`}
            >
              Log in
            </Link>
            <Link
              href="/auth/register"
              className="w-full py-2.5 text-center font-medium text-white bg-[#16A34A] hover:bg-[#15803D] rounded-xl shadow-sm"
            >
              Start Free
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}

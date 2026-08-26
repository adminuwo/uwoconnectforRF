'use client';

import React from 'react';
import Link from 'next/link';
import { Globe, MessageCircle, Share2, Mail } from 'lucide-react';

export default function KinsoFooter({ isDark }) {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Unified Inbox', href: '#features' },
        { name: 'AI Reply Assistant', href: '#features' },
        { name: 'Workflow Automation', href: '#automation' },
        { name: 'CRM Sync', href: '#features' },
        { name: 'Analytics', href: '#features' },
        { name: 'Connectors Grid', href: '#connectors' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '#' },
        { name: 'API Reference', href: '#' },
        { name: 'Guides & Tutorials', href: '#' },
        { name: 'System Status', href: '#' },
        { name: 'Customer Stories', href: '#' },
      ],
    },
    {
      title: 'Developers',
      links: [
        { name: 'Developer Portal', href: '#' },
        { name: 'REST Webhooks', href: '#' },
        { name: 'SDK Libraries', href: '#' },
        { name: 'GitHub Repo', href: '#' },
      ],
    },
    {
      title: 'Company & Legal',
      links: [
        { name: 'Pricing', href: '#' },
        { name: 'Security & Compliance', href: '#security' },
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' },
        { name: 'Contact Support', href: '/contact' },
      ],
    },
  ];

  return (
    <footer
      className={`border-t transition-colors duration-300 ${
        isDark ? 'bg-[#06080E] border-white/10 text-white' : 'bg-[#EAF7F1] border-[#00AB56]/15 text-gray-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 lg:py-20 space-y-10 sm:space-y-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-6 gap-8 sm:gap-10">
          {/* Brand Info (2 Cols) */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl overflow-hidden shadow-md shadow-[#00AB56]/20 flex items-center justify-center bg-white p-0.5 border border-[#00AB56]/20 shrink-0">
                <img
                  src="/download (3).gif"
                  alt="UWO Connect Logo"
                  className="w-full h-full object-cover rounded-lg"
                  width={40}
                  height={40}
                />
              </div>
              <span className="font-bold text-lg sm:text-xl tracking-tight">
                UWO <span className="text-[#00AB56]">Connect</span>
              </span>
            </Link>

            <p className={`text-xs leading-relaxed max-w-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              One AI Workspace for Every Customer Conversation. Streamline WhatsApp, Instagram, Telegram, Email, and social platforms from a single enterprise dashboard.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a href="#" className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#00AB56] transition-colors" aria-label="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#00AB56] transition-colors" aria-label="Community">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#00AB56] transition-colors" aria-label="Share">
                <Share2 className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl border border-gray-200 dark:border-white/10 text-gray-400 hover:text-[#00AB56] transition-colors" aria-label="Contact">
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Nav Sections (4 Cols) */}
          {footerSections.map((sec) => (
            <div key={sec.title} className="space-y-3 sm:space-y-4">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                {sec.title}
              </h4>
              <ul className="space-y-2 sm:space-y-2.5 text-xs font-medium">
                {sec.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`transition-colors hover:text-[#00AB56] block truncate ${
                        isDark ? 'text-gray-300' : 'text-gray-600'
                      }`}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4 text-center sm:text-left">
          <p>© {new Date().getFullYear()} UWO Connect Inc. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[11px] sm:text-xs">
            <Link href="/privacy" className="hover:text-[#00AB56] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-[#00AB56] transition-colors">Terms of Service</Link>
            <Link href="/security" className="hover:text-[#00AB56] transition-colors">Security Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

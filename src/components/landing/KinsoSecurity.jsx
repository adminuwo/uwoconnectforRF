'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Lock,
  UserCheck,
  FileCheck,
  Code2,
  Cloud,
  Key
} from 'lucide-react';

export default function KinsoSecurity({ isDark }) {
  const securityItems = [
    {
      title: 'SOC-ready',
      description: 'Built adhering to strict SOC 2 Type II controls, ensuring continuous data protection compliance.',
      icon: ShieldCheck,
    },
    {
      title: 'Encrypted data',
      description: 'AES-256 encryption at rest and TLS 1.3 encryption in transit across all connected channels.',
      icon: Lock,
    },
    {
      title: 'Role-based permissions',
      description: 'Granular RBAC allowing custom roles, department boundaries, and restricted workspace access.',
      icon: UserCheck,
    },
    {
      title: 'Audit logs',
      description: 'Immutable, searchable event logs capturing every agent action, AI modification, and API call.',
      icon: FileCheck,
    },
    {
      title: 'API integrations',
      description: 'Secure OAuth 2.0 authentication and signed webhook signatures for safe external data flow.',
      icon: Code2,
    },
    {
      title: 'Cloud infrastructure',
      description: 'Multi-region AWS/GCP hosting with 99.99% SLA uptime, automated failover, and DDoS mitigation.',
      icon: Cloud,
    },
    {
      title: 'Secure authentication',
      description: 'Enterprise Single Sign-On (SSO) via SAML 2.0, Okta, Google Workspace, and mandatory 2FA.',
      icon: Key,
    },
  ];

  return (
    <section id="security" className="py-14 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
            Enterprise Grade Protection
          </span>
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Security Built for Global Compliance.
          </h2>
          <p className={`text-sm sm:text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            UWO Connect protects your customer data with zero compromise on speed or reliability.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {securityItems.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.06 }}
                className={`p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#0E131F] border-white/10 hover:border-[#00AB56]/40'
                    : 'bg-white border-gray-200 hover:border-[#00AB56]/40 shadow-xs hover:shadow-md'
                }`}
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#00AB56]/10 text-[#00AB56] flex items-center justify-center mb-4 sm:mb-5">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className={`text-base sm:text-lg font-bold mb-1.5 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {sec.title}
                </h3>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {sec.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

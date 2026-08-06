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
    <section id="security" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold uppercase tracking-widest text-[#16A34A] px-3.5 py-1.5 rounded-full bg-[#16A34A]/10 border border-[#16A34A]/20">
            Enterprise Grade Protection
          </span>
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Security Built for global compliance.
          </h2>
          <p className={`text-base sm:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            UWO Connect protects your customer data with zero compromise on speed or reliability.
          </p>
        </div>

        {/* Security Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {securityItems.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <motion.div
                key={sec.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl border transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-[#0E131F] border-white/10 hover:border-[#16A34A]/40'
                    : 'bg-white border-gray-200 hover:border-[#16A34A]/40 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="w-12 h-12 rounded-2xl bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
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

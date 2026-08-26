'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  MessageSquare,
  UserCheck,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Activity,
  Radio
} from 'lucide-react';

export default function KinsoTeamCollaboration({ isDark }) {
  const agents = [
    { name: 'Alex Rivera', role: 'Lead Agent', status: 'Online', avatar: 'AR', color: 'bg-emerald-500' },
    { name: 'Sarah Jenkins', role: 'Tier-2 Support', status: 'In Conversation', avatar: 'SJ', color: 'bg-blue-500' },
    { name: 'Marcus Vance', role: 'Account Manager', status: 'Online', avatar: 'MV', color: 'bg-[#00AB56]' },
    { name: 'Elena Rostova', role: 'Supervisor', status: 'Monitoring', avatar: 'ER', color: 'bg-purple-500' },
  ];

  return (
    <section className="py-14 sm:py-20 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3 sm:space-y-4">
          <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#00AB56] px-3.5 py-1.5 rounded-full bg-[#00AB56]/10 border border-[#00AB56]/20">
            Real-Time Collaboration
          </span>
          <h2 className={`text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Built for Teams Operating as One.
          </h2>
          <p className={`text-sm sm:text-base md:text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Assign tickets, write internal notes, observe real-time typing, and manage agent permissions effortlessly.
          </p>
        </div>

        {/* Interactive Shared Workspace Card */}
        <div
          className={`rounded-2xl sm:rounded-3xl border p-4 sm:p-6 lg:p-8 relative shadow-xl sm:shadow-2xl ${
            isDark ? 'bg-[#0E131F] border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
          }`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            {/* Left side: Live Presence List */}
            <div className="lg:col-span-5 space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-gray-400">
                  Active Team Members (4 Online)
                </span>
                <span className="flex items-center gap-1.5 text-[11px] sm:text-xs text-[#00AB56] font-semibold">
                  <Radio className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse" /> Live Presence
                </span>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {agents.map((ag) => (
                  <div
                    key={ag.name}
                    className={`p-3 sm:p-3.5 rounded-xl sm:rounded-2xl border flex items-center justify-between ${
                      isDark ? 'bg-white/[0.03] border-white/5' : 'bg-gray-50 border-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl ${ag.color} text-white font-bold text-xs flex items-center justify-center shrink-0`}>
                        {ag.avatar}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-xs sm:text-sm truncate">{ag.name}</h4>
                        <span className="text-[10px] text-gray-400 block truncate">{ag.role}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="w-2 h-2 rounded-full bg-[#00AB56] animate-pulse" />
                      <span className="text-[10px] font-semibold text-[#00AB56]">{ag.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side: Shared Inbox & Internal Notes Preview */}
            <div className="lg:col-span-7 space-y-4">
              <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/[0.02] border-white/5' : 'bg-gray-50/80 border-gray-200'}`}>
                <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-white/10 mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#00AB56]" />
                    <span className="text-xs font-bold">Shared Ticket #4892 — Enterprise Onboarding</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full">
                    Assigned: Marcus Vance
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-[#00AB56]/10 border border-[#00AB56]/20">
                    <div className="flex items-center justify-between text-xs font-bold text-[#00AB56] mb-1">
                      <span>Internal Comment (Private to Team)</span>
                      <span className="text-[10px] text-gray-400">Marcus @ 10:48 AM</span>
                    </div>
                    <p className="text-xs text-gray-700 dark:text-gray-300">
                      "@Alex I have verified the SAML SSO endpoint. Customer is ready for migration."
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-400 italic">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>Alex Rivera is typing an internal note...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

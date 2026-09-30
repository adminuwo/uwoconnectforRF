'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  CheckCheck, 
  Sparkles,
  Zap,
  Clock
} from 'lucide-react';
import { WhatsAppLogo } from '../LandingBrandLogos';
import { cn } from '@/lib/utils';

/**
 * LiveUnifiedInboxWorkflow
 * An animated, modern interactive SaaS workflow demonstrating:
 * 1. Customer Message (Incoming via WhatsApp)
 * 2. Unified Inbox (Dev Hub auto-routing in 0.1s -> Sales Team Assigned)
 * 3. Team Response (Dispatched via API -> PDF quotation generated)
 * 
 * Works seamlessly on Desktop (horizontal live stream) and Tablet/Mobile (vertical live stream).
 */
export default function LiveUnifiedInboxWorkflow({ isDarkMode }) {
  // Current active step: 0 (Customer Message), 1 (Unified Inbox), 2 (Team Response)
  const [activeStep, setActiveStep] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [assignedActive, setAssignedActive] = useState(false);
  const [responseDispatched, setResponseDispatched] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    let timer;
    if (activeStep === 0) {
      // Step 1: Customer Message incoming
      setProgressWidth(0);
      setAssignedActive(false);
      setResponseDispatched(false);

      timer = setTimeout(() => {
        setActiveStep(1);
      }, 2400);
    } else if (activeStep === 1) {
      // Step 2: Unified Inbox / Dev Hub routing
      // Animate progress bar
      const progTimer = setTimeout(() => {
        setProgressWidth(100);
      }, 250);

      // Activate sales team assignment shortly after
      const assignTimer = setTimeout(() => {
        setAssignedActive(true);
      }, 950);

      // Move to step 3
      timer = setTimeout(() => {
        setActiveStep(2);
      }, 2700);

      return () => {
        clearTimeout(timer);
        clearTimeout(progTimer);
        clearTimeout(assignTimer);
      };
    } else if (activeStep === 2) {
      // Step 3: Team Response & PDF Dispatch
      const dispatchTimer = setTimeout(() => {
        setResponseDispatched(true);
      }, 400);

      // Hold completed state, then loop back
      timer = setTimeout(() => {
        setActiveStep(0);
      }, 3400);

      return () => {
        clearTimeout(timer);
        clearTimeout(dispatchTimer);
      };
    }

    return () => clearTimeout(timer);
  }, [activeStep, isPaused]);

  return (
    <div 
      className="relative z-10 w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ── DESKTOP WORKFLOW (Horizontal: >= lg) ── */}
      <div className="hidden lg:grid grid-cols-12 gap-4 items-stretch relative">
        
        {/* Animated Connector 1: Between Card 1 and Card 2 */}
        <div className="absolute top-[48px] left-[31.5%] w-[5.5%] z-20 pointer-events-none flex items-center justify-center">
          <div className="w-full relative flex items-center">
            {/* Background line track */}
            <div className={cn(
              "w-full h-[2px] rounded-full transition-colors duration-500",
              isDarkMode ? "bg-slate-800" : "bg-slate-200"
            )} />
            
            {/* Active glowing connection line */}
            <motion.div 
              className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: activeStep >= 1 ? "100%" : (activeStep === 0 ? "100%" : "0%") 
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* Moving Glowing Signal Packet */}
            {activeStep === 0 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.9)] flex items-center justify-center"
                animate={{
                  left: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.2, 1, 0.8]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            )}

            {/* Central Node Orb */}
            <div className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shadow-xs",
              activeStep >= 1 
                ? "bg-blue-500 border-blue-400 text-white shadow-blue-500/40" 
                : (isDarkMode ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400")
            )}>
              <ArrowRight size={11} className={cn("transition-transform", activeStep >= 1 ? "translate-x-0.5 text-white" : "")} />
            </div>
          </div>
        </div>

        {/* Animated Connector 2: Between Card 2 and Card 3 */}
        <div className="absolute top-[48px] right-[31.5%] w-[5.5%] z-20 pointer-events-none flex items-center justify-center">
          <div className="w-full relative flex items-center">
            {/* Background line track */}
            <div className={cn(
              "w-full h-[2px] rounded-full transition-colors duration-500",
              isDarkMode ? "bg-slate-800" : "bg-slate-200"
            )} />

            {/* Active glowing connection line */}
            <motion.div 
              className="absolute left-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ 
                width: activeStep === 2 ? "100%" : (activeStep === 1 ? "100%" : "0%") 
              }}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />

            {/* Moving Glowing Signal Packet */}
            {activeStep === 1 && (
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.9)] flex items-center justify-center"
                animate={{
                  left: ["0%", "100%"],
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1.2, 1, 0.8]
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
              </motion.div>
            )}

            {/* Central Node Orb */}
            <div className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shadow-xs",
              activeStep === 2 
                ? "bg-violet-600 border-violet-400 text-white shadow-violet-500/40" 
                : (isDarkMode ? "bg-slate-900 border-slate-800 text-slate-500" : "bg-white border-slate-200 text-slate-400")
            )}>
              <ArrowRight size={11} className={cn("transition-transform", activeStep === 2 ? "translate-x-0.5 text-white" : "")} />
            </div>
          </div>
        </div>

        {/* ── STAGE 1: CUSTOMER MESSAGE ── */}
        <div 
          onClick={() => setActiveStep(0)}
          className={cn(
            "col-span-4 p-6 sm:p-7 rounded-[2rem] border transition-all duration-500 relative cursor-pointer flex flex-col justify-between overflow-hidden",
            activeStep === 0
              ? (isDarkMode 
                  ? "bg-slate-900/95 border-emerald-500/60 shadow-[0_12px_36px_rgba(16,185,129,0.18)] ring-1 ring-emerald-500/30" 
                  : "bg-white border-emerald-500/50 shadow-[0_16px_40px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20")
              : (isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80" 
                  : "bg-white/80 border-slate-200/80 hover:border-slate-300 shadow-sm opacity-90")
          )}
        >
          {/* Subtle Stage Ambient Halo */}
          <div className={cn(
            "absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-opacity duration-500",
            activeStep === 0 ? "bg-emerald-500/15 opacity-100" : "opacity-0"
          )} />

          <div>
            {/* Header: Node number & Tag */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-300 shadow-sm",
                activeStep === 0
                  ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30 scale-105"
                  : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              )}>
                1
              </div>

              <div className="flex items-center gap-1.5">
                {activeStep === 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                )}
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider transition-all",
                  activeStep === 0
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                )}>
                  INCOMING
                </span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 relative z-10 flex items-center justify-between">
              <span>Customer Message</span>
            </h3>

            {/* Chat Bubble Simulation */}
            <div className={cn(
              "relative p-4 rounded-2xl rounded-tl-sm transition-all duration-300 border",
              activeStep === 0
                ? (isDarkMode 
                    ? "bg-slate-800/90 border-emerald-500/30 shadow-md" 
                    : "bg-emerald-50/70 border-emerald-200 shadow-xs")
                : (isDarkMode 
                    ? "bg-[#131825] border-white/5" 
                    : "bg-slate-100/90 border-slate-200/70")
            )}>
              <div className="flex items-center justify-between text-[11px] mb-2 font-semibold">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <WhatsAppLogo size={15} />
                  <span>WhatsApp • Rohan (+91 98200)</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Just now</span>
              </div>
              <p className="text-sm text-slate-900 dark:text-slate-100 font-medium leading-snug">
                “Hi! Need a GST quotation for Growth Plan”
              </p>
              <div className={cn(
                "absolute -left-2 top-0 w-4 h-4 border-t border-l rotate-45 transform origin-bottom-right",
                activeStep === 0
                  ? (isDarkMode ? "bg-slate-800/90 border-emerald-500/30" : "bg-emerald-50/70 border-emerald-200")
                  : (isDarkMode ? "bg-[#131825] border-white/5" : "bg-slate-100/90 border-slate-200/70")
              )} />
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={cn("w-1.5 h-1.5 rounded-full", activeStep === 0 ? "bg-emerald-500" : "bg-slate-400")} />
              Channel: WhatsApp Business
            </span>
            <span className="font-mono text-[10px]">API 2.4</span>
          </div>
        </div>

        {/* ── STAGE 2: UNIFIED INBOX ── */}
        <div 
          onClick={() => setActiveStep(1)}
          className={cn(
            "col-span-4 p-6 sm:p-7 rounded-[2rem] border transition-all duration-500 relative cursor-pointer flex flex-col justify-between overflow-hidden",
            activeStep === 1
              ? (isDarkMode 
                  ? "bg-slate-900/95 border-blue-500/60 shadow-[0_12px_36px_rgba(37,99,235,0.2)] ring-1 ring-blue-500/30" 
                  : "bg-white border-blue-500/50 shadow-[0_16px_40px_rgba(37,99,235,0.12)] ring-1 ring-blue-500/20")
              : (isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80" 
                  : "bg-white/80 border-slate-200/80 hover:border-slate-300 shadow-sm opacity-90")
          )}
        >
          {/* Subtle Stage Ambient Halo */}
          <div className={cn(
            "absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-opacity duration-500",
            activeStep === 1 ? "bg-blue-500/15 opacity-100" : "opacity-0"
          )} />

          <div>
            {/* Header: Node number & Tag */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-300 shadow-sm",
                activeStep === 1
                  ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30 scale-105"
                  : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
              )}>
                2
              </div>

              <div className="flex items-center gap-1.5">
                {activeStep === 1 && (
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                )}
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider transition-all",
                  activeStep === 1
                    ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                )}>
                  DEV HUB
                </span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 relative z-10 flex items-center justify-between">
              <span>Unified Inbox</span>
            </h3>

            {/* Processing UI Simulation */}
            <div className={cn(
              "relative p-4 rounded-2xl transition-all duration-300 border space-y-3.5",
              activeStep === 1
                ? (isDarkMode 
                    ? "bg-slate-800/90 border-blue-500/30 shadow-md" 
                    : "bg-blue-50/70 border-blue-200 shadow-xs")
                : (isDarkMode 
                    ? "bg-[#131825] border-white/5" 
                    : "bg-slate-50 border-slate-200/70")
            )}>
              <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
                <span className="text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  <Zap size={12} className={activeStep === 1 ? "animate-pulse" : ""} />
                  Auto-routing
                </span>
                <span className="font-mono text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/80 dark:border-slate-800">
                  0.1s
                </span>
              </div>

              {/* Progress Bar with smooth fill */}
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700/60 rounded-full overflow-hidden p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-700 ease-out"
                  style={{ width: `${activeStep >= 1 ? (activeStep === 1 ? progressWidth : 100) : 0}%` }}
                />
              </div>

              {/* Sales Team Assigned Live Indicator */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "w-2 h-2 rounded-full transition-all duration-300",
                    assignedActive || activeStep === 2
                      ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" 
                      : (activeStep === 1 ? "bg-blue-500 animate-ping" : "bg-slate-400")
                  )} />
                  <span className={cn(
                    "text-xs font-bold transition-colors duration-300",
                    assignedActive || activeStep === 2
                      ? "text-emerald-700 dark:text-emerald-400 font-extrabold"
                      : "text-slate-700 dark:text-slate-300"
                  )}>
                    Sales Team Assigned
                  </span>
                </div>

                <AnimatePresence>
                  {(assignedActive || activeStep === 2) && (
                    <motion.span
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"
                    >
                      <CheckCheck size={13} />
                      <span>Ready</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={cn("w-1.5 h-1.5 rounded-full", activeStep >= 1 ? "bg-blue-500" : "bg-slate-400")} />
              Engine: AI Matchmaker
            </span>
            <span className="font-mono text-[10px]">Tier 1 Priority</span>
          </div>
        </div>

        {/* ── STAGE 3: TEAM RESPONSE ── */}
        <div 
          onClick={() => setActiveStep(2)}
          className={cn(
            "col-span-4 p-6 sm:p-7 rounded-[2rem] border transition-all duration-500 relative cursor-pointer flex flex-col justify-between overflow-hidden",
            activeStep === 2
              ? (isDarkMode 
                  ? "bg-slate-900/95 border-violet-500/60 shadow-[0_12px_36px_rgba(139,92,246,0.2)] ring-1 ring-violet-500/30" 
                  : "bg-white border-violet-500/50 shadow-[0_16px_40px_rgba(139,92,246,0.12)] ring-1 ring-violet-500/20")
              : (isDarkMode 
                  ? "bg-slate-900/60 border-slate-800 hover:border-slate-700 opacity-80" 
                  : "bg-white/80 border-slate-200/80 hover:border-slate-300 shadow-sm opacity-90")
          )}
        >
          {/* Subtle Stage Ambient Halo */}
          <div className={cn(
            "absolute -top-12 -left-12 w-36 h-36 rounded-full blur-2xl pointer-events-none transition-opacity duration-500",
            activeStep === 2 ? "bg-violet-500/15 opacity-100" : "opacity-0"
          )} />

          <div>
            {/* Header: Node number & Tag */}
            <div className="flex items-center justify-between mb-5 relative z-10">
              <div className={cn(
                "w-11 h-11 rounded-2xl flex items-center justify-center font-black text-base transition-all duration-300 shadow-sm",
                activeStep === 2
                  ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/30 scale-105"
                  : "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400"
              )}>
                3
              </div>

              <div className="flex items-center gap-1.5">
                {activeStep === 2 && (
                  <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />
                )}
                <span className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-wider transition-all",
                  activeStep === 2
                    ? "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/40"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                )}>
                  DISPATCH
                </span>
              </div>
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-4 relative z-10 flex items-center justify-between">
              <span>Team Response</span>
            </h3>

            {/* Outbound Chat Bubble Simulation */}
            <div className={cn(
              "relative p-4 rounded-2xl rounded-tr-sm transition-all duration-300 border",
              activeStep === 2
                ? (isDarkMode 
                    ? "bg-emerald-950/40 border-emerald-500/40 shadow-md" 
                    : "bg-emerald-50/90 border-emerald-300 shadow-xs")
                : (isDarkMode 
                    ? "bg-emerald-900/10 border-emerald-500/10" 
                    : "bg-emerald-50/40 border-emerald-200/60")
            )}>
              <div className="flex items-center justify-end gap-1.5 text-emerald-600 dark:text-emerald-400 text-[11px] font-bold mb-2">
                <span>Dispatched via API</span>
                <CheckCircle2 size={13} className={cn(activeStep === 2 ? "text-emerald-500 animate-bounce" : "")} />
              </div>

              <motion.div
                animate={activeStep === 2 ? { y: [4, 0], opacity: [0.7, 1] } : {}}
                transition={{ duration: 0.4 }}
              >
                <p className="text-sm text-slate-800 dark:text-slate-200 font-medium leading-snug text-right">
                  “Quotation QT-8402 generated &amp; sent as PDF.”
                </p>

                {/* PDF Micro-Attachment Preview (clean, subtle SaaS touch) */}
                <div className="mt-2.5 pt-2 border-t border-emerald-500/20 flex items-center justify-end gap-2 text-[10px] text-emerald-800 dark:text-emerald-300 font-semibold">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 flex items-center gap-1">
                    <FileText size={11} /> QT-8402.pdf (142 KB)
                  </span>
                </div>
              </motion.div>

              <div className={cn(
                "absolute -right-2 top-0 w-4 h-4 border-t border-r rotate-45 transform origin-bottom-left",
                activeStep === 2
                  ? (isDarkMode ? "bg-emerald-950/40 border-emerald-500/40" : "bg-emerald-50/90 border-emerald-300")
                  : (isDarkMode ? "bg-emerald-900/10 border-emerald-500/10" : "bg-emerald-50/40 border-emerald-200/60")
              )} />
            </div>
          </div>

          {/* Footer Status Pill */}
          <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className={cn("w-1.5 h-1.5 rounded-full", activeStep === 2 ? "bg-emerald-500" : "bg-slate-400")} />
              Delivery: Verified • SLA 0.2s
            </span>
            <span className="font-mono text-[10px]">Closed ✓</span>
          </div>
        </div>

      </div>


      {/* ── TABLET & MOBILE WORKFLOW (Vertical: < lg) ── */}
      <div className="lg:hidden flex flex-col space-y-4 relative">

        {/* ── MOBILE STAGE 1: CUSTOMER MESSAGE ── */}
        <div 
          onClick={() => setActiveStep(0)}
          className={cn(
            "p-5 sm:p-6 rounded-[2rem] border transition-all duration-300 relative cursor-pointer",
            activeStep === 0
              ? (isDarkMode ? "bg-slate-900 border-emerald-500/60 shadow-lg" : "bg-white border-emerald-500/50 shadow-md")
              : (isDarkMode ? "bg-slate-900/70 border-slate-800 opacity-85" : "bg-white/90 border-slate-200 opacity-90")
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
              activeStep === 0
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-emerald-500/30"
                : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
            )}>
              1
            </div>

            <div className="flex items-center gap-1.5">
              {activeStep === 0 && <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />}
              <span className={cn(
                "text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                activeStep === 0
                  ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              )}>
                INCOMING
              </span>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">Customer Message</h3>

          <div className={cn(
            "relative p-3.5 rounded-2xl rounded-tl-sm border",
            activeStep === 0
              ? (isDarkMode ? "bg-slate-800/90 border-emerald-500/30" : "bg-emerald-50/70 border-emerald-200")
              : (isDarkMode ? "bg-[#131825] border-white/5" : "bg-slate-100/90 border-slate-200/70")
          )}>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-[10px] mb-1.5 font-semibold">
              <WhatsAppLogo size={14} />
              <span>WhatsApp • Rohan (+91 98200)</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium">
              “Hi! Need a GST quotation for Growth Plan”
            </p>
          </div>
        </div>

        {/* Mobile Vertical Connector 1 -> 2 */}
        <div className="flex justify-center py-0.5 relative">
          <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-800 relative">
            <motion.div
              className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-emerald-500 to-blue-500"
              animate={{ height: activeStep >= 1 ? "100%" : (activeStep === 0 ? ["0%", "100%"] : "0%") }}
              transition={{ duration: 1.2, repeat: activeStep === 0 ? Infinity : 0 }}
            />
          </div>
        </div>

        {/* ── MOBILE STAGE 2: UNIFIED INBOX ── */}
        <div 
          onClick={() => setActiveStep(1)}
          className={cn(
            "p-5 sm:p-6 rounded-[2rem] border transition-all duration-300 relative cursor-pointer",
            activeStep === 1
              ? (isDarkMode ? "bg-slate-900 border-blue-500/60 shadow-lg" : "bg-white border-blue-500/50 shadow-md")
              : (isDarkMode ? "bg-slate-900/70 border-slate-800 opacity-85" : "bg-white/90 border-slate-200 opacity-90")
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
              activeStep === 1
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-blue-500/30"
                : "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
            )}>
              2
            </div>

            <div className="flex items-center gap-1.5">
              {activeStep === 1 && <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />}
              <span className={cn(
                "text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                activeStep === 1
                  ? "bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              )}>
                DEV HUB
              </span>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">Unified Inbox</h3>

          <div className={cn(
            "relative p-3.5 rounded-2xl border space-y-3",
            activeStep === 1
              ? (isDarkMode ? "bg-slate-800/90 border-blue-500/30" : "bg-blue-50/70 border-blue-200")
              : (isDarkMode ? "bg-[#131825] border-white/5" : "bg-slate-50 border-slate-200/70")
          )}>
            <div className="flex justify-between items-center text-[10px] uppercase font-bold tracking-wider">
              <span className="text-blue-600 dark:text-blue-400">Auto-routing</span>
              <span className="text-slate-500 font-mono">0.1s</span>
            </div>

            <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{ width: `${activeStep >= 1 ? (activeStep === 1 ? progressWidth : 100) : 0}%` }}
              />
            </div>

            <div className="flex items-center gap-2 pt-0.5">
              <span className={cn(
                "w-2 h-2 rounded-full",
                assignedActive || activeStep === 2 ? "bg-emerald-500" : "bg-blue-500 animate-ping"
              )} />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Sales Team Assigned
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Vertical Connector 2 -> 3 */}
        <div className="flex justify-center py-0.5 relative">
          <div className="h-6 w-0.5 bg-slate-200 dark:bg-slate-800 relative">
            <motion.div
              className="absolute left-0 top-0 w-0.5 bg-gradient-to-b from-blue-500 to-violet-500"
              animate={{ height: activeStep === 2 ? "100%" : (activeStep === 1 ? ["0%", "100%"] : "0%") }}
              transition={{ duration: 1.2, repeat: activeStep === 1 ? Infinity : 0 }}
            />
          </div>
        </div>

        {/* ── MOBILE STAGE 3: TEAM RESPONSE ── */}
        <div 
          onClick={() => setActiveStep(2)}
          className={cn(
            "p-5 sm:p-6 rounded-[2rem] border transition-all duration-300 relative cursor-pointer",
            activeStep === 2
              ? (isDarkMode ? "bg-slate-900 border-violet-500/60 shadow-lg" : "bg-white border-violet-500/50 shadow-md")
              : (isDarkMode ? "bg-slate-900/70 border-slate-800 opacity-85" : "bg-white/90 border-slate-200 opacity-90")
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm",
              activeStep === 2
                ? "bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-violet-500/30"
                : "bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-400"
            )}>
              3
            </div>

            <div className="flex items-center gap-1.5">
              {activeStep === 2 && <span className="w-2 h-2 rounded-full bg-violet-500 animate-ping" />}
              <span className={cn(
                "text-[10px] font-black px-2.5 py-0.5 rounded-full border uppercase tracking-wider",
                activeStep === 2
                  ? "bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/40"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
              )}>
                DISPATCH
              </span>
            </div>
          </div>

          <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mb-3">Team Response</h3>

          <div className={cn(
            "relative p-3.5 rounded-2xl rounded-tr-sm border",
            activeStep === 2
              ? (isDarkMode ? "bg-emerald-950/40 border-emerald-500/40 shadow-md" : "bg-emerald-50/90 border-emerald-300")
              : (isDarkMode ? "bg-emerald-900/10 border-emerald-500/10" : "bg-emerald-50/40 border-emerald-200/60")
          )}>
            <div className="flex items-center justify-end gap-1.5 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold mb-1.5">
              <span>Dispatched via API</span>
              <CheckCircle2 size={12} />
            </div>
            <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium text-right leading-snug">
              “Quotation QT-8402 generated &amp; sent as PDF.”
            </p>
          </div>
        </div>

      </div>

      {/* ── Subtitle / Control Bar below workflow ── */}
      <div className="mt-8 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Live Stream: <span className="font-normal text-slate-500">
              {activeStep === 0 && "1. Receiving incoming customer inquiry..."}
              {activeStep === 1 && "2. Routing to sales agent via Dev Hub (0.1s)..."}
              {activeStep === 2 && "3. Quotation QT-8402 dispatched via WhatsApp API!"}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold">
          <span className="text-slate-400">Interactive:</span>
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveStep(idx)}
              className={cn(
                "px-2.5 py-1 rounded-lg border transition-all cursor-pointer",
                activeStep === idx 
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-xs" 
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-slate-400"
              )}
            >
              Step {idx + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

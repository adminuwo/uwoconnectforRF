'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowRight, ChevronLeft, ChevronRight, Play, Pause,
  Sparkles, Layers, Activity, CheckCircle2, Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { RenderIndustry3D } from './Industry3DObjects';

// ════════════════════════════════════════════════════════════════
// 8 INDUSTRY STORY SCENES (EXACT CONTENT FROM SPECIFICATION)
// ════════════════════════════════════════════════════════════════
export const STORY_SCENES = [
  {
    id: 'education',
    num: '01',
    name: 'EDUCATION',
    tagline: 'Schools, Universities & Coaching',
    heroHeadline: 'CONNECT EVERY LEARNING JOURNEY',
    description: 'Manage student enquiries, admission follow-ups and communication from one connected platform.',
    workflow: ['Student Enquiry', 'CRM', 'Follow-up', 'Admission'],
    accentColor: '#10B981',
    accentClass: 'text-emerald-500',
    bgGradient: 'from-emerald-950/40 via-teal-950/20 to-transparent',
    glowColor: 'rgba(16, 185, 129, 0.25)',
    targetPersona: 'Admissions & Academic Deans',
    stat: '99.4% Student Retention'
  },
  {
    id: 'real-estate',
    num: '02',
    name: 'REAL ESTATE',
    tagline: 'Builders, Agencies & Consultants',
    heroHeadline: 'TURN PROPERTY ENQUIRIES INTO OPPORTUNITIES',
    description: 'Organize property leads, customer conversations and site visit follow-ups.',
    workflow: ['Property Enquiry', 'Lead Management', 'Site Visit', 'Follow-up'],
    accentColor: '#3B82F6',
    accentClass: 'text-blue-500',
    bgGradient: 'from-blue-950/40 via-indigo-950/20 to-transparent',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    targetPersona: 'Builders & Property Brokers',
    stat: '3x Faster Site Visits'
  },
  {
    id: 'finance',
    num: '03',
    name: 'FINANCE',
    tagline: 'Advisors, Loans & Wealth Management',
    heroHeadline: 'BUILD STRONGER FINANCIAL CONNECTIONS',
    description: 'Manage customer enquiries, organize follow-ups and simplify financial service communication.',
    workflow: ['New Enquiry', 'Customer Record', 'Follow-up', 'Communication'],
    accentColor: '#059669',
    accentClass: 'text-emerald-600',
    bgGradient: 'from-emerald-950/40 via-teal-950/20 to-transparent',
    glowColor: 'rgba(5, 150, 105, 0.25)',
    targetPersona: 'Loan Brokers & Wealth Planners',
    stat: '100% Document Auditing'
  },
  {
    id: 'healthcare',
    num: '04',
    name: 'HEALTHCARE',
    tagline: 'Hospitals, Clinics & Diagnostic Labs',
    heroHeadline: 'MAKE EVERY PATIENT INTERACTION COUNT',
    description: 'Organize appointment enquiries, reminders and patient communication.',
    workflow: ['Appointment', 'Booking', 'Reminder', 'Follow-up'],
    accentColor: '#F43F5E',
    accentClass: 'text-rose-500',
    bgGradient: 'from-rose-950/40 via-pink-950/20 to-transparent',
    glowColor: 'rgba(244, 63, 94, 0.25)',
    targetPersona: 'Hospitals & Medical Clinics',
    stat: '0% Missed Patient Slots',
    disclaimer: 'Notice: UWO Connect provides patient communication and scheduling workflows only. It does not replace medical diagnosis.'
  },
  {
    id: 'automobile',
    num: '05',
    name: 'AUTOMOBILE',
    tagline: 'Dealerships, Showrooms & Service Centers',
    heroHeadline: 'DRIVE BETTER CUSTOMER EXPERIENCES',
    description: 'Manage vehicle enquiries, test drive requests and service communication.',
    workflow: ['Vehicle Enquiry', 'Test Drive', 'Follow-up', 'Service'],
    accentColor: '#F59E0B',
    accentClass: 'text-amber-500',
    bgGradient: 'from-amber-950/40 via-orange-950/20 to-transparent',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    targetPersona: 'Automobile Dealerships',
    stat: '85% Test Drive Conversion'
  },
  {
    id: 'logistics',
    num: '06',
    name: 'LOGISTICS',
    tagline: 'Couriers, Transport & Delivery Fleets',
    heroHeadline: 'KEEP EVERY DELIVERY CONNECTED',
    description: 'Simplify shipment-related communication, customer enquiries and delivery updates.',
    workflow: ['Shipment', 'Status Update', 'Notification', 'Support'],
    accentColor: '#8B5CF6',
    accentClass: 'text-purple-500',
    bgGradient: 'from-purple-950/40 via-violet-950/20 to-transparent',
    glowColor: 'rgba(139, 92, 246, 0.25)',
    targetPersona: 'Fleet & Cargo Operators',
    stat: '0.1s Dispatch Alerts'
  },
  {
    id: 'ecommerce',
    num: '07',
    name: 'E-COMMERCE',
    tagline: 'Online Stores, D2C Brands & Retail Shops',
    heroHeadline: 'CONNECT EVERY CUSTOMER AND ORDER',
    description: 'Manage customer enquiries, order communication and customer support.',
    workflow: ['Customer Order', 'CRM', 'Update', 'Support'],
    accentColor: '#EC4899',
    accentClass: 'text-pink-500',
    bgGradient: 'from-pink-950/40 via-rose-950/20 to-transparent',
    glowColor: 'rgba(236, 72, 153, 0.25)',
    targetPersona: 'D2C Brands & Online Stores',
    stat: '98% WhatsApp Open Rate'
  },
  {
    id: 'travel',
    num: '08',
    name: 'TRAVEL & HOSPITALITY',
    tagline: 'Hotels, Resorts & Tour Operators',
    heroHeadline: 'MAKE EVERY JOURNEY SEAMLESS',
    description: 'Organize booking enquiries, customer communication and travel updates.',
    workflow: ['Booking Enquiry', 'Follow-up', 'Confirmation', 'Updates'],
    accentColor: '#06B6D4',
    accentClass: 'text-cyan-500',
    bgGradient: 'from-cyan-950/40 via-sky-950/20 to-transparent',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    targetPersona: 'Hotels, Resorts & Tour Curators',
    stat: '24/7 Itinerary Assistant'
  }
];

export default function ParallaxStorySlider({
  isDarkMode = false,
  activeSceneId,
  onSceneChange
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef(null);

  // Mouse Parallax Offsets (-1 to 1)
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Sync with external activeSceneId if provided
  useEffect(() => {
    if (activeSceneId) {
      const idx = STORY_SCENES.findIndex(s => s.id === activeSceneId);
      if (idx !== -1 && idx !== currentIndex) {
        setCurrentIndex(idx);
      }
    }
  }, [activeSceneId, currentIndex]);

  const currentScene = STORY_SCENES[currentIndex];

  // Smooth mouse move handler for 3D parallax
  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1; // -1 to 1
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1; // -1 to 1
    setMouseOffset({ x, y });
  }, []);

  const handleMouseLeave = useCallback(() => {
    // Smooth return to equilibrium
    setMouseOffset({ x: 0, y: 0 });
    setIsHovered(false);
  }, []);

  // Slide navigation
  const goToNext = useCallback(() => {
    setCurrentIndex(prev => {
      const nextIdx = (prev + 1) % STORY_SCENES.length;
      if (onSceneChange) onSceneChange(STORY_SCENES[nextIdx].id);
      return nextIdx;
    });
  }, [onSceneChange]);

  const goToPrev = useCallback(() => {
    setCurrentIndex(prev => {
      const prevIdx = (prev - 1 + STORY_SCENES.length) % STORY_SCENES.length;
      if (onSceneChange) onSceneChange(STORY_SCENES[prevIdx].id);
      return prevIdx;
    });
  }, [onSceneChange]);

  const selectScene = (idx) => {
    setCurrentIndex(idx);
    if (onSceneChange) onSceneChange(STORY_SCENES[idx].id);
  };

  // Autoplay timer (every 6.5s, pauses on hover)
  useEffect(() => {
    if (!isAutoplay || isHovered) return;
    const timer = setInterval(() => {
      goToNext();
    }, 6500);
    return () => clearInterval(timer);
  }, [isAutoplay, isHovered, goToNext]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative w-full rounded-3xl sm:rounded-4xl overflow-hidden border transition-all duration-500 shadow-2xl",
        isDarkMode
          ? "bg-[#060911] border-slate-800 text-white"
          : "bg-gradient-to-b from-white via-slate-50 to-slate-100 border-slate-200/90 text-slate-900"
      )}
      style={{
        perspective: '1400px',
        minHeight: '680px'
      }}
    >
      {/* ════════════════════════════════════════════════════════════════ */}
      {/* LAYER 1: ATMOSPHERIC 3D BACKGROUND                               */}
      {/* Moves slowest in opposite direction of mouse                     */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div
        className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out -z-10"
        style={{
          transform: `translate3d(${mouseOffset.x * -18}px, ${mouseOffset.y * -18}px, -100px) rotateX(${mouseOffset.y * 3}deg) rotateY(${mouseOffset.x * -3}deg)`
        }}
      >
        {/* Dynamic Scene Ambient Radial Glow */}
        <div
          className="absolute top-1/4 left-1/3 w-[600px] h-[600px] rounded-full blur-[140px] opacity-70 transition-colors duration-700 pointer-events-none"
          style={{ backgroundColor: currentScene.accentColor }}
        />

        {/* Large Watermark Industry Counter */}
        <div className="absolute top-4 right-8 select-none pointer-events-none opacity-5 sm:opacity-10 text-[12rem] sm:text-[18rem] font-black leading-none font-sans text-slate-400">
          {currentScene.num}
        </div>

        {/* Spatial 3D Grid Lines */}
        <div
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? '#ffffff' : '#000000'} 1px, transparent 1px)`,
            backgroundSize: '80px 80px'
          }}
        />
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* TOP CONTROLS & INDUSTRY SELECTOR TABS                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 px-5 sm:px-8 pt-6 pb-2 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200/40 dark:border-slate-800/60 backdrop-blur-md">

        {/* Quick Industry Pill Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none select-none">
          {STORY_SCENES.map((scene, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => selectScene(idx)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0 border relative",
                  isActive
                    ? "bg-[#0B8F78] text-white border-[#0B8F78] shadow-md shadow-emerald-500/25 scale-105"
                    : isDarkMode
                      ? "bg-slate-900/60 text-slate-400 hover:text-white border-slate-800 hover:bg-slate-800"
                      : "bg-white/80 text-slate-600 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
                )}
              >
                <span>{scene.name}</span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white ml-1.5 inline-block animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Autoplay & Navigation Controls */}
        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsAutoplay(!isAutoplay)}
            title={isAutoplay ? "Pause Autoplay" : "Start Autoplay"}
            className={cn(
              "p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5",
              isDarkMode
                ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
            )}
          >
            {isAutoplay ? <Pause size={14} className="text-emerald-500" /> : <Play size={14} />}
            <span className="hidden sm:inline text-[11px]">{isAutoplay ? "Auto" : "Paused"}</span>
          </button>

          <button
            type="button"
            onClick={goToPrev}
            title="Previous Industry"
            className={cn(
              "p-2 rounded-xl border transition-all cursor-pointer",
              isDarkMode
                ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
            )}
          >
            <ChevronLeft size={16} />
          </button>

          <button
            type="button"
            onClick={goToNext}
            title="Next Industry"
            className={cn(
              "p-2 rounded-xl border transition-all cursor-pointer",
              isDarkMode
                ? "bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 shadow-2xs"
            )}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* MAIN 3D PARALLAX STAGE (LAYER 2 & LAYER 3 IN PERSPECTIVE)         */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="relative px-6 sm:px-12 py-10 sm:py-16 min-h-[540px] flex items-center justify-center overflow-hidden">

        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            initial={{ opacity: 0, scale: 0.92, z: -150 }}
            animate={{ opacity: 1, scale: 1, z: 0 }}
            exit={{ opacity: 0, scale: 1.08, z: 120 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl mx-auto relative flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14"
            style={{ transformStyle: 'preserve-3d' }}
          >

            {/* ════════════════════════════════════════════════════════════ */}
            {/* LAYER 2: GIANT BACKGROUND TYPOGRAPHY (TEXT BEHIND OBJECTS)   */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none -z-10 transition-transform duration-300 ease-out"
              style={{
                transform: `translate3d(${mouseOffset.x * -35}px, ${mouseOffset.y * -35}px, -40px) rotateX(${mouseOffset.y * 6}deg) rotateY(${mouseOffset.x * -6}deg)`
              }}
            >
              <h2
                className={cn(
                  "font-black tracking-tighter text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] leading-none text-center whitespace-nowrap opacity-[0.07] dark:opacity-[0.14] uppercase",
                  isDarkMode ? "text-white" : "text-slate-900"
                )}
                style={{
                  textShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}
              >
                {currentScene.name}
              </h2>
            </div>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* LEFT COLUMN: MIDGROUND STORYTELLING & WORKFLOW               */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div
              className="flex-1 space-y-6 text-center lg:text-left z-20 transition-transform duration-300 ease-out max-w-xl"
              style={{
                transform: `translate3d(${mouseOffset.x * -30}px, ${mouseOffset.y * -30}px, 20px)`
              }}
            >
              {/* Category & Step Pill */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: currentScene.accentColor }} />
                <span className="text-[11px] font-black uppercase tracking-widest text-[#0B8F78]">
                  Industry #{currentScene.num} • {currentScene.tagline}
                </span>
              </div>

              {/* Headline */}
              <h3 className={cn(
                "text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.12]",
                isDarkMode ? "text-white" : "text-slate-900"
              )}>
                {currentScene.heroHeadline}
              </h3>

              {/* Description */}
              <p className={cn(
                "text-sm sm:text-base leading-relaxed font-normal",
                isDarkMode ? "text-slate-300" : "text-slate-600"
              )}>
                {currentScene.description}
              </p>

              {/* Disclaimer if present */}
              {currentScene.disclaimer && (
                <p className="text-[11px] text-amber-500/90 font-medium bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20">
                  {currentScene.disclaimer}
                </p>
              )}

              {/* 4-Step Animated Interactive Workflow Pipeline */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5 text-[#0B8F78]" />
                  <span>Automated Workflow Sequence:</span>
                </div>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 sm:gap-2">
                  {currentScene.workflow.map((step, sidx) => (
                    <React.Fragment key={sidx}>
                      <span
                        className={cn(
                          "px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5",
                          sidx === 0
                            ? "bg-[#0B8F78]/15 border-[#0B8F78]/40 text-[#0B8F78]"
                            : isDarkMode
                              ? "bg-slate-900/70 border-slate-800 text-slate-300"
                              : "bg-white border-slate-200 text-slate-700 shadow-2xs"
                        )}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0B8F78]" />
                        <span>{step}</span>
                      </span>
                      {sidx < currentScene.workflow.length - 1 && (
                        <span className="text-slate-400 font-bold text-xs">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/auth/register"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#0B8F78] to-[#0F766E] text-white text-xs font-bold shadow-lg shadow-emerald-700/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Launch for {currentScene.name}</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  href="/book"
                  className={cn(
                    "w-full sm:w-auto px-6 py-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                    isDarkMode
                      ? "border-slate-800 bg-slate-900/60 text-slate-200 hover:bg-slate-800"
                      : "border-slate-300 bg-white text-slate-800 hover:bg-slate-100 shadow-2xs"
                  )}
                >
                  <span>Book Demo</span>
                </Link>
              </div>

            </div>

            {/* ════════════════════════════════════════════════════════════ */}
            {/* RIGHT COLUMN: LAYER 3 FOREGROUND 3D CUTOUT OBJECTS          */}
            {/* Moves fastest with strong perspective tilt & overlaps text   */}
            {/* ════════════════════════════════════════════════════════════ */}
            <div
              className="flex-1 w-full flex items-center justify-center relative min-h-[340px] sm:min-h-[420px] transition-transform duration-300 ease-out z-30"
              style={{
                transform: `translate3d(${mouseOffset.x * -70}px, ${mouseOffset.y * -70}px, 60px) rotateX(${mouseOffset.y * 14}deg) rotateY(${mouseOffset.x * -14}deg)`,
                transformStyle: 'preserve-3d'
              }}
            >
              {/* Foreground Floating 3D Vector Objects */}
              <div className="relative z-30 transform hover:scale-105 transition-transform duration-300">
                <RenderIndustry3D sceneId={currentScene.id} className="w-full max-w-[380px] sm:max-w-[460px] h-auto" />
              </div>

              {/* Floating Floating Stat Badge (Overlapping 3D Plane) */}
              <div
                className={cn(
                  "absolute -bottom-4 sm:bottom-2 left-4 sm:left-10 z-40 p-3 sm:p-4 rounded-2xl border backdrop-blur-xl shadow-2xl transition-transform duration-300 flex items-center gap-3",
                  isDarkMode
                    ? "bg-slate-900/90 border-slate-700/80 text-white"
                    : "bg-white/95 border-slate-200 text-slate-900"
                )}
                style={{
                  transform: `translate3d(${mouseOffset.x * -40}px, ${mouseOffset.y * -40}px, 90px)`
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: currentScene.accentColor }}
                >
                  <Sparkles size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                    {currentScene.targetPersona}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-[#0B8F78]">
                    {currentScene.stat}
                  </div>
                </div>
              </div>

            </div>

          </motion.div>
        </AnimatePresence>

      </div>

      {/* ════════════════════════════════════════════════════════════════ */}
      {/* BOTTOM PROGRESS DOTS & SLIDE COUNTER                             */}
      {/* ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-30 px-6 sm:px-12 py-4 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-500">
        <div className="flex items-center gap-2">
          <span>Scene {currentIndex + 1} of {STORY_SCENES.length}</span>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <span className="text-[#0B8F78] font-bold">{currentScene.name}</span>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center gap-1.5">
          {STORY_SCENES.map((_, dotIdx) => (
            <button
              key={dotIdx}
              type="button"
              onClick={() => selectScene(dotIdx)}
              title={`Jump to Scene ${dotIdx + 1}`}
              className={cn(
                "h-2 rounded-full transition-all cursor-pointer",
                currentIndex === dotIdx
                  ? "w-8 bg-[#0B8F78] shadow-[0_0_8px_#10B981]"
                  : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

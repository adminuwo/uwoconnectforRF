'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Volume2, VolumeX, Sparkles, PlayCircle } from 'lucide-react';
import FullscreenVideo from './FullscreenVideo';
import CinematicOverlay from './CinematicOverlay';
import GlassTrustPill from './GlassTrustPill';

const UWOHeroVideo = () => {
  const [isMuted, setIsMuted] = useState(true);

  const handleExploreClick = () => {
    const nextSection = document.getElementById('trusted-by') || document.querySelector('main');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[640px] max-h-[1080px] flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
      
      {/* 1. Full-Screen Background Video Engine */}
      <FullscreenVideo />

      {/* 2. Dark Translucent Cinematic Vignette Overlay */}
      <CinematicOverlay />

      {/* 3. STABLE Centered Foreground Hierarchy (Fixed Content) */}
      <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 sm:px-6 max-w-5xl mx-auto space-y-6 sm:space-y-8 select-none">
        
        {/* Brand Name / Header Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-black uppercase tracking-widest backdrop-blur-md shadow-2xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>UWO Connect</span>
        </div>

        {/* Primary Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] drop-shadow-2xl max-w-4xl">
          Everything Your Business Needs.{' '}
          <span className="text-emerald-400 underline decoration-emerald-400/30 underline-offset-8">
            Connected in One Place.
          </span>
        </h1>

        {/* Supporting Subtitle */}
        <p className="text-base sm:text-xl text-slate-200 font-normal leading-relaxed max-w-2xl mx-auto drop-shadow-md">
          Connect your conversations, clients, teams and business operations through one unified workspace.
        </p>

        {/* Glass Pill Element */}
        <div className="pt-2">
          <GlassTrustPill text="One connected workspace for your entire business" />
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 w-full sm:w-auto">
          {/* Primary CTA */}
          <Link
            href="/auth/register"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#00AB56] hover:bg-[#008947] text-slate-950 font-black px-9 py-4 rounded-2xl text-base shadow-xl shadow-[#00AB56]/30 hover:shadow-2xl hover:shadow-[#00AB56]/40 transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </Link>

          {/* Secondary CTA */}
          <button
            onClick={handleExploreClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900/80 hover:bg-slate-850 text-white font-bold px-8 py-4 rounded-2xl text-base border border-slate-700/80 hover:border-emerald-500/50 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg"
          >
            <PlayCircle size={18} className="text-emerald-400" />
            <span>Explore UWO Connect</span>
          </button>
        </div>

      </div>

      {/* 4. Subtle Unobtrusive Sound Control */}
      <button
        type="button"
        onClick={() => setIsMuted(!isMuted)}
        className="absolute bottom-6 right-6 z-30 px-3.5 py-2 rounded-2xl bg-slate-950/80 hover:bg-slate-900 text-slate-200 border border-slate-800 backdrop-blur-md transition-all flex items-center gap-2 font-bold text-xs cursor-pointer shadow-2xl"
        title={isMuted ? "Turn Sound On" : "Mute Sound"}
      >
        {isMuted ? <VolumeX size={15} className="text-rose-400" /> : <Volume2 size={15} className="text-emerald-400" />}
        <span>{isMuted ? "Sound Off" : "Sound On"}</span>
      </button>

    </section>
  );
};

export default UWOHeroVideo;

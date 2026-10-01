'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  ArrowLeft,
  Sparkles,
  Headphones,
  Check,
  RotateCcw,
} from 'lucide-react';

const VOICES = [
  {
    id: 'nova',
    name: 'Nova',
    gender: 'Female',
    tag: 'Official Female Tour Voice',
    recommended: true,
    tone: 'Energetic, warm & engaging',
    bestFor: 'Product walkthroughs, tutorials & welcoming new users',
    color: 'from-emerald-500 to-teal-600',
    avatar: '👩',
  },
  {
    id: 'cedar',
    name: 'Cedar',
    gender: 'Male',
    tag: 'Official Male Tour Voice',
    recommended: true,
    tone: 'Smooth, confident & natural',
    bestFor: 'Executive tutorials, business onboarding & clear demos',
    color: 'from-amber-500 to-emerald-600',
    avatar: '👨',
  },
  {
    id: 'alloy',
    name: 'Alloy',
    gender: 'Neutral / Female',
    tone: 'Balanced, modern & precise',
    bestFor: 'Corporate SaaS, finance & formal presentations',
    color: 'from-blue-500 to-indigo-600',
    avatar: '🎙️',
  },
  {
    id: 'echo',
    name: 'Echo',
    gender: 'Male',
    tone: 'Smooth, conversational & natural',
    bestFor: 'Friendly sales demos & everyday onboarding',
    color: 'from-amber-500 to-orange-600',
    avatar: '👨',
  },
  {
    id: 'onyx',
    name: 'Onyx',
    gender: 'Male',
    tone: 'Deep, authoritative & executive',
    bestFor: 'Enterprise SaaS, security & serious announcements',
    color: 'from-slate-700 to-slate-900',
    avatar: '👔',
  },
  {
    id: 'shimmer',
    name: 'Shimmer',
    gender: 'Female',
    tone: 'Soft, pleasant & clear',
    bestFor: 'Help centers, relaxation & educational explainers',
    color: 'from-purple-500 to-pink-600',
    avatar: '🌸',
  },
  {
    id: 'fable',
    name: 'Fable',
    gender: 'Male',
    tone: 'Expressive, British-tinted & storytelling',
    bestFor: 'Narrative storytelling & engaging presentations',
    color: 'from-rose-500 to-red-600',
    avatar: '🎩',
  },
  {
    id: 'coral',
    name: 'Coral',
    gender: 'Female',
    tone: 'Fresh, bright & approachable',
    bestFor: 'Fast-paced apps & modern tech startups',
    color: 'from-cyan-500 to-blue-600',
    avatar: '✨',
  },
  {
    id: 'sage',
    name: 'Sage',
    gender: 'Neutral / Female',
    tone: 'Thoughtful, calm & intelligent',
    bestFor: 'Analytics, data dashboards & technical guidance',
    color: 'from-teal-600 to-emerald-700',
    avatar: '🧠',
  },
  {
    id: 'ash',
    name: 'Ash',
    gender: 'Male',
    tone: 'Casual, direct & confident',
    bestFor: 'Quick tips, shortcuts & direct action items',
    color: 'from-stone-600 to-zinc-800',
    avatar: '🎧',
  },
];

export default function VoiceSamplesPage() {
  const [activeVoice, setActiveVoice] = useState(null);
  const [activeLang, setActiveLang] = useState('en');
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVoice, setSelectedVoice] = useState('nova');
  const audioRef = useRef(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('uwo_tour_voice');
      if (saved) setSelectedVoice(saved);
    } catch (e) {}

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const handleSelectVoice = (voiceId) => {
    setSelectedVoice(voiceId);
    try {
      localStorage.setItem('uwo_tour_voice', voiceId);
    } catch (e) {}
  };

  const handlePlay = (voiceId, lang) => {
    // If clicking same audio that is playing, toggle pause
    if (activeVoice === voiceId && activeLang === lang && isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
      return;
    }

    if (audioRef.current) {
      audioRef.current.pause();
    }

    const src = `/audio/samples/${voiceId}_${lang}.mp3`;
    const audio = new Audio(src);
    audioRef.current = audio;

    audio.onplay = () => {
      setActiveVoice(voiceId);
      setActiveLang(lang);
      setIsPlaying(true);
    };

    audio.onended = () => {
      setIsPlaying(false);
      setActiveVoice(null);
    };

    audio.onerror = () => {
      setIsPlaying(false);
      setActiveVoice(null);
    };

    audio.play().catch((err) => {
      console.error('Playback error:', err);
      setIsPlaying(false);
    });
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
    setActiveVoice(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/client"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-all shadow-sm"
          >
            <ArrowLeft size={14} /> Back to Dashboard
          </Link>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
            <Sparkles size={13} /> OpenAI gpt-4o-mini-tts Studio
          </span>
        </div>

        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            OpenAI Voice Audition Studio
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed">
            Listen to all official OpenAI AI voices in both <span className="text-emerald-400 font-semibold">English</span> and <span className="text-emerald-400 font-semibold">Hindi</span>. Choose the voice persona that best matches your brand vibe.
          </p>
        </div>
      </div>

      {/* Voice Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {VOICES.map((v) => {
          const isCurrentActive = activeVoice === v.id && isPlaying;
          const isEnPlaying = isCurrentActive && activeLang === 'en';
          const isHiPlaying = isCurrentActive && activeLang === 'hi';
          const isChosen = selectedVoice === v.id;

          return (
            <div
              key={v.id}
              className={`relative rounded-3xl p-6 transition-all duration-300 border flex flex-col justify-between ${
                isChosen
                  ? 'bg-slate-800/90 border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.15)] ring-1 ring-emerald-500/30'
                  : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60'
              }`}
            >
              {/* Top Row: Avatar & Badges */}
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${v.color} flex items-center justify-center text-2xl shadow-md shadow-black/20`}>
                      {v.avatar}
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white flex items-center gap-2">
                        {v.name}
                        {v.recommended && (
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                      </h3>
                      <span className="text-xs text-slate-400 font-medium">
                        {v.gender}
                      </span>
                    </div>
                  </div>

                  {/* Wave Equalizer when playing */}
                  {isCurrentActive && (
                    <div className="flex items-end gap-1 h-5 px-2 py-1 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-4" />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-2" style={{ animationDelay: '0.15s' }} />
                      <span className="w-1 bg-emerald-400 rounded-full animate-pulse h-5" style={{ animationDelay: '0.3s' }} />
                    </div>
                  )}
                </div>

                {/* Tone & Description */}
                <div className="space-y-2 mb-6">
                  <div className="text-xs">
                    <span className="text-slate-400 font-medium">Tone: </span>
                    <span className="text-slate-200 font-semibold">{v.tone}</span>
                  </div>
                  <div className="text-xs text-slate-400 leading-relaxed bg-slate-900/50 p-2.5 rounded-xl border border-slate-800">
                    💡 <span className="text-slate-300 font-medium">{v.bestFor}</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Play EN / Play HI */}
              <div className="pt-4 border-t border-slate-700/50 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {/* English Sample Button */}
                  <button
                    onClick={() => handlePlay(v.id, 'en')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isEnPlaying
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/60'
                    }`}
                  >
                    {isEnPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>English</span>
                  </button>

                  {/* Hindi Sample Button */}
                  <button
                    onClick={() => handlePlay(v.id, 'hi')}
                    className={`px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isHiPlaying
                        ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/25 scale-[1.02]'
                        : 'bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-600/60'
                    }`}
                  >
                    {isHiPlaying ? <Pause size={13} /> : <Play size={13} />}
                    <span>हिन्दी</span>
                  </button>
                </div>

                {/* Select button */}
                <button
                  onClick={() => handleSelectVoice(v.id)}
                  className={`w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    isChosen
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-slate-900/60 hover:bg-slate-900 text-slate-400 hover:text-slate-300 border border-slate-800'
                  }`}
                >
                  {isChosen ? (
                    <>
                      <Check size={13} /> Active Tour Voice
                    </>
                  ) : (
                    'Set as Tour Voice'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sample Texts Preview Box */}
      <div className="max-w-4xl mx-auto mt-12 p-6 rounded-3xl bg-slate-800/40 border border-slate-800 text-xs text-slate-400 leading-relaxed">
        <h4 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
          <Headphones size={15} className="text-emerald-400" /> Audition Script Used in Above Samples:
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">🇬🇧 English:</span>
            "Hello! Welcome to UWO Connect. I am your AI assistant for customer chat automation, CRM pipelines, and business growth."
          </div>
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800">
            <span className="text-emerald-400 font-bold block mb-1">🇮🇳 हिन्दी:</span>
            "नमस्ते! UWO Connect में आपका स्वागत है। मैं आपका AI असिस्टेंट हूँ जो आपके चैट्स, इनवॉइस और बिज़नेस को ऑटोमेट करता है।"
          </div>
        </div>
      </div>
    </div>
  );
}

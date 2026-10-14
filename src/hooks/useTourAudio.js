'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for synchronized Voice Audio Narration during UWO Connect Tour & Tutorials.
 * 
 * Powered by OpenAI gpt-4o-mini-tts:
 *  - Female Voice: "nova" (default)
 *  - Male Voice: "cedar"
 * 
 * Sources:
 * 1. Pre-generated MP3 studio audio files located at `/audio/tour/[voice]/[step]_[lang].mp3`.
 * 2. Fallback to root `/audio/tour/[step]_[lang].mp3` or step-specified audioUrl.
 * 3. Fallback to browser Web Speech Synthesis API with voice gender matching.
 * 4. Harmonic transition chime using Web Audio API.
 */
export const useTourAudio = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [language, setLanguageState] = useState('hi'); // 'hi' (Hindi) or 'en' (English)
  const [voice, setVoiceState] = useState('dev');     // 'dev' (Male / Channels & CRM) or 'abha' (Female / Automations)
  const [voices, setVoices] = useState([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const audioElRef = useRef(null);
  const audioCtxRef = useRef(null);
  const currentUtteranceRef = useRef(null);
  const mountedRef = useRef(false);
  const languageRef = useRef(language);
  const voiceRef = useRef(voice);

  useEffect(() => {
    languageRef.current = language;
  }, [language]);

  useEffect(() => {
    voiceRef.current = voice;
  }, [voice]);

  // Initialize preferences from localStorage and load browser voices
  useEffect(() => {
    if (typeof window === 'undefined') return;
    mountedRef.current = true;

    // Load saved preferences
    try {
      const savedMuted = localStorage.getItem('uwo_tour_audio_muted');
      if (savedMuted !== null) {
        setIsMuted(savedMuted === 'true');
      }

      const savedLang = localStorage.getItem('uwo_tour_audio_lang');
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguageState(savedLang);
      }

      const savedVoice = localStorage.getItem('uwo_tour_voice');
      if (savedVoice === 'dev' || savedVoice === 'cedar') {
        setVoiceState('dev');
      } else if (savedVoice === 'abha' || savedVoice === 'nova') {
        setVoiceState('abha');
      }
    } catch (e) {
      // Ignore localStorage access issues
    }

    // Load browser speech synthesis voices for fallback
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        const availableVoices = window.speechSynthesis.getVoices();
        if (availableVoices && availableVoices.length > 0) {
          setVoices(availableVoices);
        }
      }
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Track user interaction to satisfy browser autoplay policies
    const handleFirstUserInteraction = () => {
      setHasInteracted(true);
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };

    window.addEventListener('click', handleFirstUserInteraction, { once: true });
    window.addEventListener('keydown', handleFirstUserInteraction, { once: true });

    return () => {
      mountedRef.current = false;
      stopAudio();
      window.removeEventListener('click', handleFirstUserInteraction);
      window.removeEventListener('keydown', handleFirstUserInteraction);
    };
  }, []);

  /**
   * Play a subtle, premium Web Audio API synthesized transition chime.
   */
  const playChime = useCallback(() => {
    if (isMuted || typeof window === 'undefined') return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContext();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      // Harmonic pleasant two-tone transition: 587.33Hz (D5) -> 880Hz (A5)
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.08, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.36);
    } catch (e) {
      // AudioContext failure is non-fatal
    }
  }, [isMuted]);

  /**
   * Stop any current speech or audio playback immediately.
   */
  const stopAudio = useCallback(() => {
    if (typeof window !== 'undefined') {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (audioElRef.current) {
        audioElRef.current.pause();
        audioElRef.current.currentTime = 0;
      }
    }
    setIsSpeaking(false);
  }, []);

  /**
   * Pick the most natural voice for the target language and gender preference.
   */
  const getBestVoice = useCallback((lang, targetVoice) => {
    if (!voices || voices.length === 0) return null;
    const isMale = targetVoice === 'dev' || targetVoice === 'cedar';

    if (lang === 'hi') {
      // Prefer dedicated Hindi voices matching gender preference if possible
      const hiVoices = voices.filter(
        (v) =>
          v.lang.toLowerCase().startsWith('hi') ||
          v.name.toLowerCase().includes('hindi') ||
          v.name.toLowerCase().includes('hemant') ||
          v.name.toLowerCase().includes('kalpana')
      );
      if (hiVoices.length > 0) {
        if (isMale) {
          const maleHi = hiVoices.find(v => v.name.toLowerCase().includes('hemant') || v.name.toLowerCase().includes('male'));
          if (maleHi) return maleHi;
        } else {
          const femaleHi = hiVoices.find(v => v.name.toLowerCase().includes('kalpana') || v.name.toLowerCase().includes('female'));
          if (femaleHi) return femaleHi;
        }
        return hiVoices[0];
      }

      // Fallback to Indian English voice
      const inEnVoice = voices.find((v) => v.lang.toLowerCase().includes('en-in'));
      if (inEnVoice) return inEnVoice;
    }

    // For English: match gender preference
    if (isMale) {
      const maleEn = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en') &&
          (v.name.includes('Mark') ||
            v.name.includes('David') ||
            v.name.includes('Guy') ||
            v.name.includes('George') ||
            v.name.includes('Male'))
      );
      if (maleEn) return maleEn;
    } else {
      const femaleEn = voices.find(
        (v) =>
          v.lang.toLowerCase().startsWith('en') &&
          (v.name.includes('Zira') ||
            v.name.includes('Samantha') ||
            v.name.includes('Jenny') ||
            v.name.includes('Aria') ||
            v.name.includes('Female'))
      );
      if (femaleEn) return femaleEn;
    }

    return voices.find((v) => v.lang.toLowerCase().startsWith('en')) || voices[0] || null;
  }, [voices]);

  /**
   * Browser Speech Synthesis fallback engine.
   */
  const speakViaSynthesis = useCallback((step, lang, targetVoice) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const textToSpeak = lang === 'hi' 
      ? (step.audioHi || `${step.title}. ${step.description}`)
      : (step.audioEn || `${step.title}. ${step.description}`);

    if (!textToSpeak) return;

    try {
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      currentUtteranceRef.current = utterance;

      const chosenVoice = getBestVoice(lang, targetVoice);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
        utterance.lang = chosenVoice.lang;
      } else {
        utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      }

      const isMale = targetVoice === 'dev' || targetVoice === 'cedar';
      utterance.rate = lang === 'hi' ? 0.95 : 0.98;
      utterance.pitch = isMale ? 0.85 : 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        if (mountedRef.current) setIsSpeaking(true);
      };
      utterance.onend = () => {
        if (mountedRef.current) setIsSpeaking(false);
      };
      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && mountedRef.current) {
          setIsSpeaking(false);
        }
      };

      setTimeout(() => {
        if (mountedRef.current && !isMuted) {
          window.speechSynthesis.speak(utterance);
        }
      }, 50);
    } catch (e) {
      setIsSpeaking(false);
    }
  }, [isMuted, getBestVoice]);

  /**
   * Narrate a specific tour step.
   * Plays OpenAI audio for the selected voice persona (Dev or Abha),
   * falling back to root audio files and browser synthesis.
   */
  const speakStep = useCallback((step, targetLang, targetVoice) => {
    if (!step) return;
    const lang = targetLang || languageRef.current || 'hi';
    const rawVoice = targetVoice || step.voice || voiceRef.current || 'dev';
    const activeVoice = (rawVoice === 'dev' || rawVoice === 'cedar') ? 'dev' : 'abha';

    if (activeVoice !== voiceRef.current) {
      setVoiceState(activeVoice);
      voiceRef.current = activeVoice;
    }

    stopAudio();

    if (isMuted) return;

    // Play subtle transition chime
    playChime();

    // Determine the step key (e.g., 'welcome', 'channels', 'automations', 'knowledge')
    const stepKey = step.key || step.id?.replace(/^sidebar-/, '') || 'welcome';

    // 1. Primary: Voice persona specific folder (dev / abha)
    const primaryUrl = `/audio/tour/${activeVoice}/${stepKey}_${lang}.mp3`;
    // 2. Secondary: Cedar / Nova fallback
    const secondaryVoiceUrl = `/audio/tour/${activeVoice === 'dev' ? 'cedar' : 'nova'}/${stepKey}_${lang}.mp3`;
    // 3. Root tour audio directory or explicit config URLs
    const fallbackUrl = lang === 'hi' 
      ? (step.audioUrlHi || `/audio/tour/${stepKey}_hi.mp3`)
      : (step.audioUrl || `/audio/tour/${stepKey}_en.mp3`);

    const tryPlayAudio = (url, onFail) => {
      try {
        const audio = new Audio(url);
        audioElRef.current = audio;
        audio.onplay = () => {
          if (mountedRef.current) setIsSpeaking(true);
        };
        audio.onended = () => {
          if (mountedRef.current) setIsSpeaking(false);
        };
        audio.onerror = () => {
          if (onFail) onFail();
        };
        audio.play().catch(() => {
          if (onFail) onFail();
        });
      } catch (err) {
        if (onFail) onFail();
      }
    };

    // Try primary voice-specific file -> secondary voice file -> root file -> speech synthesis
    tryPlayAudio(primaryUrl, () => {
      tryPlayAudio(secondaryVoiceUrl, () => {
        tryPlayAudio(fallbackUrl, () => {
          speakViaSynthesis(step, lang, activeVoice);
        });
      });
    });
  }, [isMuted, playChime, stopAudio, speakViaSynthesis]);

  /**
   * Toggle mute / unmute.
   */
  const toggleMute = useCallback((currentStepObj) => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('uwo_tour_audio_muted', next.toString());
      } catch (e) {}

      if (next) {
        stopAudio();
      } else if (currentStepObj) {
        // When unmuting, narrate current step immediately
        setTimeout(() => speakStep(currentStepObj, languageRef.current, currentStepObj.voice || voiceRef.current), 50);
      }
      return next;
    });
  }, [stopAudio, speakStep]);

  /**
   * Change narration language (Hindi <-> English).
   */
  const setLanguage = useCallback((newLang, currentStepObj) => {
    if (newLang !== 'hi' && newLang !== 'en') return;
    setLanguageState(newLang);
    languageRef.current = newLang;
    try {
      localStorage.setItem('uwo_tour_audio_lang', newLang);
    } catch (e) {}

    if (currentStepObj && !isMuted) {
      speakStep(currentStepObj, newLang, currentStepObj.voice || voiceRef.current);
    }
  }, [isMuted, speakStep]);

  /**
   * Switch between voice personas: 'dev' (Male) <-> 'abha' (Female).
   */
  const setVoice = useCallback((newVoice, currentStepObj) => {
    const normalized = (newVoice === 'dev' || newVoice === 'cedar') ? 'dev' : 'abha';
    setVoiceState(normalized);
    voiceRef.current = normalized;
    try {
      localStorage.setItem('uwo_tour_voice', normalized);
    } catch (e) {}

    if (currentStepObj && !isMuted) {
      speakStep(currentStepObj, languageRef.current, normalized);
    }
  }, [isMuted, speakStep]);

  /**
   * Replay current step audio with active settings.
   */
  const replayAudio = useCallback((step) => {
    if (!step) return;
    if (isMuted) {
      setIsMuted(false);
      try {
        localStorage.setItem('uwo_tour_audio_muted', 'false');
      } catch (e) {}
    }
    speakStep(step, language, step.voice || voice);
  }, [isMuted, language, voice, speakStep]);

  return {
    isSpeaking,
    isMuted,
    language,
    voice,
    hasInteracted,
    speakStep,
    stopAudio,
    replayAudio,
    toggleMute,
    setLanguage,
    setVoice,
    playChime,
  };
};

export default useTourAudio;

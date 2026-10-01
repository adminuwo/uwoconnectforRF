'use client';

import React, {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react';
import { useTour } from '@/context/TourContext';
import {
  ChevronLeft,
  ChevronRight,
  X,
  Lightbulb,
  Info,
  CheckCircle2,
  BookOpen,
  Volume2,
  VolumeX,
  RotateCcw,
} from 'lucide-react';
import LearningCenterModal from '@/components/guides/LearningCenterModal';
import { useTourAudio } from '@/hooks/useTourAudio';

const STEP_TO_GUIDE_MAP = {
  'welcome': 'dashboard',
  'sidebar-channels': 'connectors',
  'sidebar-automations': 'workflows',
  'sidebar-workflows': 'workflows',
  'sidebar-crm': 'crm',
  'sidebar-inbox': 'inbox',
  'sidebar-knowledge': 'knowledge',
  'sidebar-campaigns': 'broadcasts',
  'sidebar-catalog': 'catalog',
  'sidebar-invoices': 'connectors',
  'sidebar-payments': 'connectors',
};

// ─── Constants ────────────────────────────────────────────────────────────────
const SPOTLIGHT_PAD  = 10; // px padding around the spotlit element
const TOOLTIP_WIDTH  = 380; // px
const TOOLTIP_OFFSET = 20; // px gap between spotlight edge and tooltip

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getPlacement(rect, windowW, windowH, preferred) {
  if (preferred !== 'auto') return preferred;
  const spaceRight  = windowW - rect.right;
  const spaceLeft   = rect.left;
  const spaceBottom = windowH - rect.bottom;
  const spaceTop    = rect.top;
  const order       = ['right', 'left', 'bottom', 'top'];
  const spaces      = { right: spaceRight, left: spaceLeft, bottom: spaceBottom, top: spaceTop };
  return order.reduce((a, b) => (spaces[a] >= spaces[b] ? a : b));
}

function computeTooltipPosition(rect, placement, windowW, windowH) {
  const pad = SPOTLIGHT_PAD;
  const w   = TOOLTIP_WIDTH;

  let top  = 0;
  let left = 0;

  switch (placement) {
    case 'right':
      top  = rect.top  + rect.height / 2;
      left = rect.right + pad + TOOLTIP_OFFSET;
      if (left + w > windowW - 16) left = rect.left - w - pad - TOOLTIP_OFFSET;
      break;
    case 'left':
      top  = rect.top + rect.height / 2;
      left = rect.left - w - pad - TOOLTIP_OFFSET;
      if (left < 16) left = rect.right + pad + TOOLTIP_OFFSET;
      break;
    case 'bottom':
      top  = rect.bottom + pad + TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - w / 2;
      break;
    case 'top':
    default:
      top  = rect.top - pad - TOOLTIP_OFFSET;
      left = rect.left + rect.width / 2 - w / 2;
      break;
  }

  const tooltipH = Math.min(420, windowH * 0.85);
  if (top + tooltipH > windowH - 16) top = windowH - tooltipH - 16;
  if (top < 16) top = 16;

  if (left + w > windowW - 16) left = windowW - w - 16;
  if (left < 16) left = 16;

  return { top, left };
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
const ProgressBar = ({ current, total }) => (
  <div className="tour-progress-bar">
    <div
      className="tour-progress-fill"
      style={{ width: `${((current + 1) / total) * 100}%` }}
    />
  </div>
);

// ─── Tooltip Card ─────────────────────────────────────────────────────────────
const TooltipCard = ({
  step,
  currentStep,
  totalSteps,
  position,
  placement,
  onNext,
  onPrev,
  onSkip,
  onFinish,
  visible,
  onOpenGuide,
  isSpeaking,
  isMuted,
  language,
  voice,
  onToggleMute,
  onReplayAudio,
  onSetLanguage,
}) => {
  const isLast  = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  const triangle = {
    right:  'tour-tooltip-triangle-left',
    left:   'tour-tooltip-triangle-right',
    bottom: 'tour-tooltip-triangle-top',
    top:    'tour-tooltip-triangle-bottom',
  }[placement] || '';

  return (
    <div
      className={`tour-tooltip ${visible ? 'tour-tooltip-visible' : ''} ${triangle}`}
      style={{ top: position.top, left: position.left, width: TOOLTIP_WIDTH }}
      role="dialog"
      aria-label={`Tour step ${currentStep + 1} of ${totalSteps}: ${step.title}`}
    >
      {/* Header */}
      <div className="tour-tooltip-header">
        <div className="tour-tooltip-icon">{step.icon}</div>
        <div className="tour-tooltip-meta">
          <span className="tour-step-badge">Step {currentStep + 1} of {totalSteps}</span>
          <h3 className="tour-tooltip-title">{step.title?.replace(/^[\p{Emoji}\u200d\uFE0F\s]+/u, '') || step.title}</h3>
        </div>
        <button
          className="tour-skip-x"
          onClick={onSkip}
          aria-label="Skip tour"
          title="Skip tour"
        >
          <X size={16} />
        </button>
      </div>

      {/* Synchronized Voice Audio Narration Bar */}
      <div className="tour-audio-bar">
        <div className="flex items-center gap-2">
          {/* Animated Equalizer Waves */}
          <div className={`tour-audio-eq ${isSpeaking ? 'tour-audio-eq-active' : ''}`} title={isSpeaking ? "Voice Guide: Speaking" : "Voice Guide: Ready"}>
            <span className="eq-bar eq-bar-1" />
            <span className="eq-bar eq-bar-2" />
            <span className="eq-bar eq-bar-3" />
            <span className="eq-bar eq-bar-4" />
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
              {isSpeaking ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  <span>{voice === 'cedar' ? '👨 Cedar' : '👩 Nova'}: Speaking</span>
                </>
              ) : isMuted ? (
                'Voice: Muted'
              ) : (
                <span>{voice === 'cedar' ? '👨 Cedar' : '👩 Nova'}: Ready</span>
              )}
            </span>
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center gap-1.5">
          {/* Language Switcher Button (HI / EN) */}
          <button
            type="button"
            onClick={() => onSetLanguage(language === 'hi' ? 'en' : 'hi', step)}
            className="tour-audio-btn tour-audio-lang-btn"
            title={`Switch to ${language === 'hi' ? 'English' : 'हिन्दी'} narration`}
          >
            {language === 'hi' ? '🇮🇳 HI' : '🌐 EN'}
          </button>

          {/* Replay Audio Button */}
          <button
            type="button"
            onClick={() => onReplayAudio(step)}
            className="tour-audio-btn"
            title="Replay Voice Narration"
            aria-label="Replay voice narration"
          >
            <RotateCcw size={12} />
          </button>

          {/* Mute / Unmute Button */}
          <button
            type="button"
            onClick={() => onToggleMute(step)}
            className={`tour-audio-btn ${isMuted ? 'tour-audio-btn-muted' : ''}`}
            title={isMuted ? "Unmute Voice Guide" : "Mute Voice Guide"}
            aria-label={isMuted ? "Unmute voice guide" : "Mute voice guide"}
          >
            {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="tour-tooltip-body">
        <p className="tour-description">{step.description}</p>

        {step.why && (
          <div className="tour-why">
            <Info size={13} className="tour-why-icon" />
            <p>{step.why}</p>
          </div>
        )}

        {step.tip && (
          <div className="tour-tip">
            <Lightbulb size={13} className="tour-tip-icon" />
            <p><strong>Tip:</strong> {step.tip}</p>
          </div>
        )}

        {/* View Guide Link */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => onOpenGuide && onOpenGuide(step.id)}
            className="text-[11px] font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <BookOpen size={12} className="text-emerald-600" />
            <span>View Full Guide</span>
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* Footer Buttons */}
      <div className="tour-tooltip-footer">
        <button className="tour-btn-skip" onClick={onSkip}>
          {isLast ? 'Finish' : 'Skip Tour'}
        </button>

        <div className="tour-nav-buttons">
          {!isFirst && (
            <button className="tour-btn-prev" onClick={onPrev} aria-label="Previous step">
              <ChevronLeft size={16} /> Prev
            </button>
          )}
          {isLast ? (
            <button className="tour-btn-finish" onClick={onFinish}>
              <CheckCircle2 size={16} /> Done!
            </button>
          ) : (
            <button className="tour-btn-next" onClick={onNext} aria-label="Next step">
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const ProductTour = () => {
  const {
    isActive,
    isNavigating,
    currentStep,
    totalSteps,
    step,
    nextStep,
    prevStep,
    skipTour,
    finishTour,
  } = useTour();

  const {
    isSpeaking,
    isMuted,
    language,
    voice,
    speakStep,
    stopAudio,
    replayAudio,
    toggleMute,
    setLanguage,
    setVoice,
  } = useTourAudio();

  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tooltipPos,    setTooltipPos]    = useState({ top: 0, left: 0 });
  const [placement,     setPlacement]     = useState('bottom');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [activeGuideSlug, setActiveGuideSlug] = useState(null);
  const rafRef      = useRef(null);
  const retryRef    = useRef(null);
  const retryCount  = useRef(0);

  const handleOpenGuideFromStep = (stepId) => {
    stopAudio();
    const slug = STEP_TO_GUIDE_MAP[stepId] || 'dashboard';
    setActiveGuideSlug(slug);
  };

  const handleNext = () => {
    stopAudio();
    nextStep();
  };

  const handlePrev = () => {
    stopAudio();
    prevStep();
  };

  const handleSkip = () => {
    stopAudio();
    skipTour();
  };

  const handleFinish = () => {
    stopAudio();
    finishTour();
  };

  const positionOnElement = useCallback(() => {
    if (!isActive || !step || isNavigating) return;

    const el = document.querySelector(step.selector);
    if (!el) {
      if (retryCount.current < 15) {
        retryCount.current++;
        retryRef.current = setTimeout(positionOnElement, 200);
      } else {
        handleNext();
      }
      return;
    }

    const rect = el.getBoundingClientRect();
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;

    const resolvedPlacement = getPlacement(rect, windowW, windowH, step.placement || 'auto');
    const pos = computeTooltipPosition(rect, resolvedPlacement, windowW, windowH);

    setSpotlightRect({
      top:    rect.top    - SPOTLIGHT_PAD,
      left:   rect.left   - SPOTLIGHT_PAD,
      width:  rect.width  + SPOTLIGHT_PAD * 2,
      height: rect.height + SPOTLIGHT_PAD * 2,
    });
    setPlacement(resolvedPlacement);
    setTooltipPos(pos);

    setTimeout(() => setTooltipVisible(true), 80);
  }, [isActive, step, isNavigating, nextStep]);

  useEffect(() => {
    setTooltipVisible(false);
    clearTimeout(retryRef.current);
    retryCount.current = 0;

    if (!isActive || isNavigating) {
      setSpotlightRect(null);
      stopAudio();
      return;
    }

    const t = setTimeout(positionOnElement, 150);
    return () => clearTimeout(t);
  }, [isActive, isNavigating, currentStep, positionOnElement, stopAudio]);

  // Synchronized voice audio narration on step display
  useEffect(() => {
    if (!isActive || !step || isNavigating) {
      stopAudio();
      return;
    }

    // Trigger voice narration as soon as step element is active and spotlight is positioned
    const speechTimer = setTimeout(() => {
      speakStep(step);
    }, 280);

    return () => {
      clearTimeout(speechTimer);
      stopAudio();
    };
  }, [isActive, isNavigating, currentStep, step, speakStep, stopAudio]);

  useEffect(() => {
    if (!isActive) return;
    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(positionOnElement);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, positionOnElement]);

  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e) => {
      if (e.key === 'Escape')      { e.preventDefault(); handleSkip(); }
      if (e.key === 'ArrowRight')  { e.preventDefault(); handleNext(); }
      if (e.key === 'ArrowLeft')   { e.preventDefault(); handlePrev(); }
      if (e.key === ' ')           { e.preventDefault(); replayAudio(step); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, handleNext, handlePrev, handleSkip, replayAudio, step]);

  if (!isActive && !activeGuideSlug) return null;

  const sr = spotlightRect;
  const overlayStyle = sr
    ? {
        '--spot-top':    `${sr.top}px`,
        '--spot-left':   `${sr.left}px`,
        '--spot-width':  `${sr.width}px`,
        '--spot-height': `${sr.height}px`,
      }
    : {};

  return (
    <>
      {isActive && (
        <>
          {/* Overlay + Spotlight */}
          <div
            className={`tour-overlay ${sr ? 'tour-overlay-spotlight' : ''}`}
            style={overlayStyle}
            aria-hidden="true"
          />

          {/* Spotlight border glow */}
          {sr && (
            <div
              className="tour-spotlight-ring"
              style={{
                top:    sr.top,
                left:   sr.left,
                width:  sr.width,
                height: sr.height,
              }}
            />
          )}

          {/* Tooltip Card */}
          {step && !isNavigating && (
            <TooltipCard
              step={step}
              currentStep={currentStep}
              totalSteps={totalSteps}
              position={tooltipPos}
              placement={placement}
              onNext={handleNext}
              onPrev={handlePrev}
              onSkip={handleSkip}
              onFinish={handleFinish}
              visible={tooltipVisible}
              onOpenGuide={handleOpenGuideFromStep}
              isSpeaking={isSpeaking}
              isMuted={isMuted}
              language={language}
              voice={voice}
              onToggleMute={toggleMute}
              onReplayAudio={replayAudio}
              onSetLanguage={setLanguage}
            />
          )}

          {/* Loading indicator while navigating pages */}
          {isNavigating && (
            <div className="tour-nav-loading">
              <div className="tour-nav-loading-dot" />
              <div className="tour-nav-loading-dot" style={{ animationDelay: '0.15s' }} />
              <div className="tour-nav-loading-dot" style={{ animationDelay: '0.3s' }} />
              <span>Loading next step…</span>
            </div>
          )}
        </>
      )}

      {/* Interactive Learning Center Modal */}
      <LearningCenterModal
        guideSlug={activeGuideSlug}
        isOpen={!!activeGuideSlug}
        onClose={() => setActiveGuideSlug(null)}
      />
    </>
  );
};

export default ProductTour;

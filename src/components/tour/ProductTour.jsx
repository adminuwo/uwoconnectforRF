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
  HelpCircle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

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
      // clamp horizontally
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

  // Vertical clamping — use 85% of viewport as safe max height estimate
  const tooltipH = Math.min(420, windowH * 0.85);
  if (top + tooltipH > windowH - 16) top = windowH - tooltipH - 16;
  if (top < 16) top = 16;

  // Horizontal clamping
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
}) => {
  const isLast  = currentStep === totalSteps - 1;
  const isFirst = currentStep === 0;

  // anchor triangle side
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
      {/* ── Header ── */}
      <div className="tour-tooltip-header">
        <div className="tour-tooltip-icon">{step.icon}</div>
        <div className="tour-tooltip-meta">
          <span className="tour-step-badge">Step {currentStep + 1} of {totalSteps}</span>
          <h3 className="tour-tooltip-title">{step.title}</h3>
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

      {/* ── Body ── */}
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
      </div>

      {/* ── Progress Bar ── */}
      <ProgressBar current={currentStep} total={totalSteps} />

      {/* ── Footer Buttons ── */}
      <div className="tour-tooltip-footer">
        <button
          className="tour-btn-skip"
          onClick={onSkip}
        >
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

  const [spotlightRect, setSpotlightRect] = useState(null);
  const [tooltipPos,    setTooltipPos]    = useState({ top: 0, left: 0 });
  const [placement,     setPlacement]     = useState('bottom');
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const rafRef      = useRef(null);
  const retryRef    = useRef(null);
  const retryCount  = useRef(0);

  // ── Find & position target element ──────────────────────────────────────────
  const positionOnElement = useCallback(() => {
    if (!isActive || !step || isNavigating) return;

    if (process.env.NODE_ENV === 'development' && retryCount.current === 0) {
      console.log(`[Tour Debug] Step loaded: ${step.id}`);
    }

    const el = document.querySelector(step.selector);
    if (!el) {
      // Element not found — retry a few times (e.g. page still loading)
      if (retryCount.current < 15) { // 3 seconds max (15 * 200ms)
        retryCount.current++;
        retryRef.current = setTimeout(positionOnElement, 200);
      } else {
        if (process.env.NODE_ENV === 'development') {
          console.warn(`[Tour Debug] Error: Target element missing for selector: ${step.selector}`);
        }
        // Auto-skip this step if element isn't found
        nextStep();
      }
      return;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Tour Debug] Target element found for selector: ${step.selector}`);
    }
    retryCount.current = -1; // Prevent multiple logs for same step if resize triggers it

    // Smooth-scroll element into view — check if it has a scrollable parent (e.g. sidebar nav)
    let parent = el.parentElement;
    let scrolledParent = false;
    while (parent && parent !== document.body) {
      const style = window.getComputedStyle(parent);
      if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
        el.scrollIntoView({ behavior: 'auto', block: 'nearest' });
        scrolledParent = true;
        break;
      }
      parent = parent.parentElement;
    }
    
    // If not in a scrollable sub-container, scroll window if it is not a fixed layout component
    if (!scrolledParent) {
      let isFixed = false;
      let currentEl = el;
      while (currentEl && currentEl !== document.body) {
        if (window.getComputedStyle(currentEl).position === 'fixed') {
          isFixed = true;
          break;
        }
        currentEl = currentEl.parentElement;
      }
      if (!isFixed) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
      }
    }

    // Wait for scroll to settle then measure
    const t = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      const resolvedPlacement = getPlacement(rect, winW, winH, step.placement);
      const pos = computeTooltipPosition(rect, resolvedPlacement, winW, winH);

      setSpotlightRect({
        top:    rect.top    - SPOTLIGHT_PAD,
        left:   rect.left   - SPOTLIGHT_PAD,
        width:  rect.width  + SPOTLIGHT_PAD * 2,
        height: rect.height + SPOTLIGHT_PAD * 2,
      });
      setPlacement(resolvedPlacement);
      setTooltipPos(pos);

      // Animate in
      setTimeout(() => setTooltipVisible(true), 80);
    }, 450);

    return () => clearTimeout(t);
  }, [isActive, step, isNavigating, nextStep]);

  useEffect(() => {
    setTooltipVisible(false);
    clearTimeout(retryRef.current);
    retryCount.current = 0;

    if (!isActive || isNavigating) {
      setSpotlightRect(null);
      return;
    }

    const t = setTimeout(positionOnElement, 150);
    return () => clearTimeout(t);
  }, [isActive, isNavigating, currentStep, positionOnElement]);

  // ── Reposition on window resize ──────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const handleResize = () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(positionOnElement);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isActive, positionOnElement]);

  // ── Keyboard navigation ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!isActive) return;
    const handleKey = (e) => {
      if (e.key === 'Escape')      { e.preventDefault(); skipTour(); }
      if (e.key === 'ArrowRight')  { e.preventDefault(); nextStep(); }
      if (e.key === 'ArrowLeft')   { e.preventDefault(); prevStep(); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isActive, nextStep, prevStep, skipTour]);

  if (!isActive) return null;

  // ── Spotlight clip-path values ───────────────────────────────────────────────
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
      {/* ── Overlay + Spotlight ── */}
      <div
        className={`tour-overlay ${sr ? 'tour-overlay-spotlight' : ''}`}
        style={overlayStyle}
        aria-hidden="true"
      />

      {/* ── Spotlight border glow ── */}
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

      {/* ── Tooltip ── */}
      {step && !isNavigating && (
        <TooltipCard
          step={step}
          currentStep={currentStep}
          totalSteps={totalSteps}
          position={tooltipPos}
          placement={placement}
          onNext={nextStep}
          onPrev={prevStep}
          onSkip={skipTour}
          onFinish={finishTour}
          visible={tooltipVisible}
        />
      )}

      {/* ── Loading indicator while navigating pages ── */}
      {isNavigating && (
        <div className="tour-nav-loading">
          <div className="tour-nav-loading-dot" />
          <div className="tour-nav-loading-dot" style={{ animationDelay: '0.15s' }} />
          <div className="tour-nav-loading-dot" style={{ animationDelay: '0.3s' }} />
          <span>Loading next step…</span>
        </div>
      )}
    </>
  );
};

export default ProductTour;

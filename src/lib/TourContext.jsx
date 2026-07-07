'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import tourSteps from './tourConfig';

// ─── Constants ────────────────────────────────────────────────────────────────
const TOUR_COMPLETED_KEY = 'aisa_tour_completed';
const TOUR_PENDING_KEY   = 'aisa_tour_pending';
const TOUR_STEP_KEY      = 'aisa_tour_step';
const TOUR_ACTIVE_KEY    = 'aisa_tour_active';

// ─── Context ──────────────────────────────────────────────────────────────────
const TourContext = createContext(null);

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used inside TourProvider');
  return ctx;
};

// ─── Provider ─────────────────────────────────────────────────────────────────
export const TourProvider = ({ children }) => {
  const [isActive,     setIsActive]     = useState(false);
  const [currentStep,  setCurrentStep]  = useState(0);
  const [isNavigating, setIsNavigating] = useState(false); // true while waiting for page load
  const pathname = usePathname();
  const router   = useRouter();
  const prevPathRef = useRef(pathname);
  const mountedRef  = useRef(false);

  const totalSteps = tourSteps.length;

  const debugLog = (msg, data) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Tour Debug] ${msg}`, data || '');
    }
  };

  // ── Auto-start on first login or Resume on refresh ──────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined') return;
    mountedRef.current = true;
    debugLog('Tour initialized');

    const pending   = localStorage.getItem(TOUR_PENDING_KEY);
    const completed = localStorage.getItem(TOUR_COMPLETED_KEY);
    const savedStep = localStorage.getItem(TOUR_STEP_KEY);
    const wasActive = localStorage.getItem(TOUR_ACTIVE_KEY);

    if (pending === 'true' && completed !== 'true') {
      debugLog('First-time user detected');
      const t = setTimeout(() => {
        localStorage.removeItem(TOUR_PENDING_KEY);
        startTour(0);
      }, 1200);
      return () => clearTimeout(t);
    } else if (wasActive === 'true' && completed !== 'true') {
      // Resume tour
      const stepIdx = savedStep ? parseInt(savedStep, 10) : 0;
      debugLog(`Resuming tour at step ${stepIdx}`);
      setIsActive(true);
      setCurrentStep(stepIdx);
      const step = tourSteps[stepIdx];
      if (step && step.page && step.page !== pathname) {
        setIsNavigating(true);
        prevPathRef.current = pathname;
        router.push(step.page);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Detect page change while tour is active ────────────────────────────────
  useEffect(() => {
    if (!isActive || !isNavigating) return;
    if (pathname !== prevPathRef.current) {
      prevPathRef.current = pathname;
      // Page has changed — wait a tick for DOM to settle then clear nav flag
      const t = setTimeout(() => setIsNavigating(false), 600);
      return () => clearTimeout(t);
    }
  }, [pathname, isActive, isNavigating]);

  // ── startTour ──────────────────────────────────────────────────────────────
  const startTour = useCallback((startIndex = 0) => {
    setCurrentStep(startIndex);
    setIsActive(true);
    setIsNavigating(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOUR_ACTIVE_KEY, 'true');
      localStorage.setItem(TOUR_STEP_KEY, startIndex.toString());
      localStorage.removeItem(TOUR_COMPLETED_KEY);
    }
  }, []);

  // ── navigate to step ───────────────────────────────────────────────────────
  const goToStep = useCallback(
    (stepIndex) => {
      if (stepIndex < 0 || stepIndex >= totalSteps) return;
      const step     = tourSteps[stepIndex];
      const needsNav = step.page && step.page !== pathname;

      if (typeof window !== 'undefined') {
        localStorage.setItem(TOUR_STEP_KEY, stepIndex.toString());
      }

      if (needsNav) {
        setIsNavigating(true);
        prevPathRef.current = pathname;
        setCurrentStep(stepIndex);
        router.push(step.page);
      } else {
        setCurrentStep(stepIndex);
      }
    },
    [pathname, router, totalSteps]
  );

  // ── nextStep ───────────────────────────────────────────────────────────────
  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      goToStep(currentStep + 1);
    } else {
      finishTour();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, totalSteps, goToStep]);

  // ── prevStep ───────────────────────────────────────────────────────────────
  const prevStep = useCallback(() => {
    if (currentStep > 0) goToStep(currentStep - 1);
  }, [currentStep, goToStep]);

  // ── skipTour ───────────────────────────────────────────────────────────────
  const skipTour = useCallback(() => {
    debugLog('Tour completed');
    setIsActive(false);
    setIsNavigating(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      localStorage.removeItem(TOUR_ACTIVE_KEY);
      localStorage.removeItem(TOUR_STEP_KEY);
    }
  }, []);

  // ── finishTour ─────────────────────────────────────────────────────────────
  const finishTour = useCallback(() => {
    debugLog('Tour completed');
    setIsActive(false);
    setIsNavigating(false);
    if (typeof window !== 'undefined') {
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
      localStorage.removeItem(TOUR_ACTIVE_KEY);
      localStorage.removeItem(TOUR_STEP_KEY);
    }
  }, []);

  // ── resetTour (for Settings replay) ────────────────────────────────────────
  const resetTour = useCallback(() => {
    startTour(0);
  }, [startTour]);

  const value = {
    isActive,
    isNavigating,
    currentStep,
    totalSteps,
    step: tourSteps[currentStep],
    steps: tourSteps,
    startTour,
    nextStep,
    prevStep,
    skipTour,
    finishTour,
    resetTour,
    goToStep,
  };

  return <TourContext.Provider value={value}>{children}</TourContext.Provider>;
};

export default TourContext;

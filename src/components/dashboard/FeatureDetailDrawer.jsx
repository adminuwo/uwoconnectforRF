'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Check, Rocket, BookOpen
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { getFeatureById } from '@/lib/featureData';

// ── Backdrop overlay ──────────────────────────────────────────────────────────
const Overlay = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.2 }}
    onClick={onClick}
    className="fixed inset-0 bg-black/65 backdrop-blur-xs z-0"
    aria-hidden="true"
  />
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:border-emerald-800/80',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    beta: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:border-violet-800/80',
    coming_soon: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:border-amber-800/80',
  };
  const labels = {
    active: 'Active', inactive: 'Inactive', beta: 'Beta', coming_soon: 'Coming Soon',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${colors[status] || colors.active}`}>
      {labels[status] || status}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ── CONCISE POPUP MODAL COMPONENT ─────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const FeatureDetailDrawer = ({ featureId, isOpen, onClose, onOpenGuide }) => {
  const router = useRouter();
  const feature = featureId ? getFeatureById(featureId) : null;

  // ESC key to close
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!feature) return null;

  const Icon = feature.icon;

  const handleOpenGuide = () => {
    const guideSlug = feature.id;
    onClose();
    if (onOpenGuide) {
      onOpenGuide(guideSlug);
    } else {
      router.push(`/client/guides?slug=${guideSlug}`);
    }
  };

  // Top 4 key features only (concise & punchy, excluding telegram)
  const topFeatures = (feature.features || [])
    .filter(f => !f.toLowerCase().includes('telegram'))
    .slice(0, 4);

  // Top 3-4 key benefits
  const keyBenefits = (feature.overview?.benefits || []).slice(0, 4);

  // Top connectors / channels (excluding telegram)
  const connectors = (feature.connectors || [])
    .filter(c => !c.toLowerCase().includes('telegram'))
    .slice(0, 6);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <Overlay onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', damping: 25, stiffness: 340 }}
            className="relative w-full max-w-xl bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200/90 dark:border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 z-10"
            role="dialog"
            aria-label={`${feature.name} feature details`}
          >
            {/* ── HEADER ─────────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-5 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center shadow-xs shrink-0">
                  <Icon size={20} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">{feature.name}</h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{feature.category}</span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <StatusBadge status={feature.status} />
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* ── CONCISE BODY ───────────────────────────────────────── */}
            <div className="px-6 py-5 space-y-5 overflow-y-auto max-h-[60vh] custom-scroll">
              
              {/* Summary Description */}
              <div className="space-y-2">
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {feature.overview?.what || feature.description}
                </p>

                {/* Key Benefit Badges */}
                {keyBenefits.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {keyBenefits.map((b, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/50"
                      >
                        ✓ {b}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Core Capabilities (Top 4 items only) */}
              {topFeatures.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Core Capabilities
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {topFeatures.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/80 text-slate-800 dark:text-slate-200"
                      >
                        <Check size={14} className="text-emerald-500 shrink-0" />
                        <span className="truncate">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Supported Channels & Integrations (if any) */}
              {connectors.length > 0 && (
                <div className="space-y-2 pt-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
                    Connected Integrations
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {connectors.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200/70 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── FOOTER ACTIONS ─────────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-4 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/40 flex items-center justify-between gap-3">
              <button
                onClick={handleOpenGuide}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen size={14} className="text-emerald-500" />
                <span>View Guide</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => { onClose(); router.push(feature.path); }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm cursor-pointer"
                >
                  <Rocket size={14} />
                  <span>Launch {feature.name}</span>
                </button>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            .custom-scroll::-webkit-scrollbar { width: 5px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
            :global(.dark) .custom-scroll::-webkit-scrollbar-thumb { background: #334155; }
            :global(.dark) .custom-scroll::-webkit-scrollbar-thumb:hover { background: #475569; }
          `}</style>
        </div>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailDrawer;

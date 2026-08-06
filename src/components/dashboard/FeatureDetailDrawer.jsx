'use client';

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ExternalLink, ArrowUpRight, Check, AlertTriangle,
  Zap, Sparkles, BarChart3, BookOpen, Shield,
  ChevronRight, Info, Lightbulb, AlertCircle,
  FileText, Play, HelpCircle, Settings, Rocket,
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
    className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[60]"
    aria-hidden="true"
  />
);

// ── Status badge ──────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const colors = {
    active: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    inactive: 'bg-slate-100 text-slate-600 border-slate-200',
    beta: 'bg-violet-100 text-violet-800 border-violet-200',
    coming_soon: 'bg-amber-100 text-amber-800 border-amber-200',
  };
  const labels = {
    active: 'Active', inactive: 'Inactive', beta: 'Beta', coming_soon: 'Coming Soon',
  };
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${colors[status] || colors.active}`}>
      {labels[status] || status}
    </span>
  );
};

// ── Section wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, iconColor, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay }}
    className="space-y-3"
  >
    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
      {Icon && <Icon size={14} className={iconColor || 'text-slate-500'} />}
      {title}
    </h4>
    {children}
  </motion.div>
);

// ── Feature check card ────────────────────────────────────────────────────────
const FeatureCard = ({ text }) => (
  <div className="flex items-start gap-2 p-2.5 bg-emerald-50/60 border border-emerald-100/60 rounded-xl text-xs text-emerald-900 font-medium">
    <Check size={13} className="text-emerald-600 mt-0.5 shrink-0" />
    <span>{text}</span>
  </div>
);

// ── Limitation warning card ───────────────────────────────────────────────────
const LimitationCard = ({ title, detail }) => (
  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
    <div className="flex items-center gap-1.5">
      <AlertTriangle size={12} className="text-amber-600 shrink-0" />
      <span className="text-[11px] font-bold text-amber-800">{title}</span>
    </div>
    <p className="text-[11px] text-amber-700/80 font-medium leading-relaxed pl-5">{detail}</p>
  </div>
);

// ── Requirement item ──────────────────────────────────────────────────────────
const RequirementItem = ({ text }) => (
  <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
    <div className="w-4 h-4 rounded-md bg-emerald-100 border border-emerald-200 flex items-center justify-center shrink-0">
      <Check size={10} className="text-emerald-700" />
    </div>
    {text}
  </div>
);

// ── AI capability pill ────────────────────────────────────────────────────────
const AIPill = ({ text }) => (
  <div className="flex items-start gap-2 p-2.5 bg-violet-50/60 border border-violet-100/60 rounded-xl text-xs text-violet-900 font-medium">
    <Sparkles size={13} className="text-violet-500 mt-0.5 shrink-0" />
    <span>{text}</span>
  </div>
);

// ── Connector badge ───────────────────────────────────────────────────────────
const ConnectorBadge = ({ name }) => (
  <span className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 shadow-xs">
    {name}
  </span>
);

// ── Error card ────────────────────────────────────────────────────────────────
const ErrorCard = ({ error, fix }) => (
  <div className="p-3 bg-red-50/60 border border-red-100/60 rounded-xl space-y-1">
    <div className="flex items-center gap-1.5">
      <AlertCircle size={12} className="text-red-500 shrink-0" />
      <span className="text-[11px] font-bold text-red-800">{error}</span>
    </div>
    <p className="text-[11px] text-red-700/80 font-medium leading-relaxed pl-5">Fix: {fix}</p>
  </div>
);

// ── Stat card ─────────────────────────────────────────────────────────────────
const StatCard = ({ label, value }) => (
  <div className="p-3 bg-white border border-slate-200/60 rounded-xl text-center shadow-xs">
    <span className="text-lg font-black text-slate-900 block">{value}</span>
    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════════
// ── MAIN DRAWER COMPONENT ─────────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const FeatureDetailDrawer = ({ featureId, isOpen, onClose, onOpenGuide }) => {
  const router = useRouter();
  const scrollRef = useRef(null);
  const feature = featureId ? getFeatureById(featureId) : null;

  // Reset scroll when feature changes
  useEffect(() => {
    if (isOpen && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [featureId, isOpen]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <Overlay onClick={onClose} />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full sm:w-[540px] md:w-[580px] bg-white/95 backdrop-blur-xl border-l border-slate-200/60 z-[65] flex flex-col shadow-2xl"
            role="dialog"
            aria-label={`${feature.name} feature details`}
          >
            {/* ── STICKY HEADER ─────────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-5 border-b border-slate-100 bg-white/90 backdrop-blur-md">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200/60 flex items-center justify-center shadow-sm">
                    <Icon size={20} className="text-emerald-700" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 tracking-tight">{feature.name}</h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{feature.category}</span>
                      <span className="text-slate-200">•</span>
                      <StatusBadge status={feature.status} />
                    </div>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 hover:text-slate-700"
                  aria-label="Close drawer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Quick actions */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => { onClose(); router.push(feature.path); }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Rocket size={13} /> Launch Feature
                </button>
                <button
                  onClick={handleOpenGuide}
                  className="px-3.5 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <BookOpen size={13} className="text-emerald-400" /> View Complete Guide
                </button>
                <button
                  onClick={() => { onClose(); router.push('/client/settings'); }}
                  className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Settings size={13} /> Settings
                </button>
              </div>
            </div>

            {/* ── SCROLLABLE BODY ───────────────────────────────────────── */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scroll">

              {/* OVERVIEW */}
              <Section title="Overview" icon={Info} iconColor="text-blue-500" delay={0.05}>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{feature.description}</p>
                <div className="p-4 bg-slate-50/80 border border-slate-200/40 rounded-2xl space-y-3 mt-2">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">What it does</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{feature.overview?.what}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1">Why businesses use it</span>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">{feature.overview?.why}</p>
                  </div>
                  {feature.overview?.benefits && (
                    <div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block mb-1.5">Key benefits</span>
                      <div className="flex flex-wrap gap-1.5">
                        {feature.overview.benefits.map((b, i) => (
                          <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-100 rounded-lg text-[10px] font-semibold">{b}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Section>

              {/* AVAILABLE FEATURES */}
              {feature.features?.length > 0 && (
                <Section title={`Available Features (${feature.features.length})`} icon={Check} iconColor="text-emerald-600" delay={0.1}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {feature.features.map((f, i) => <FeatureCard key={i} text={f} />)}
                  </div>
                </Section>
              )}

              {/* LIMITATIONS */}
              {feature.limitations?.length > 0 && (
                <Section title="Feature Limitations" icon={AlertTriangle} iconColor="text-amber-500" delay={0.15}>
                  <div className="p-3 bg-amber-50/50 border border-amber-200/40 rounded-2xl space-y-2">
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-wider">Current Plan Limits</span>
                    <div className="space-y-2">
                      {feature.limitations.map((l, i) => <LimitationCard key={i} {...l} />)}
                    </div>
                  </div>
                </Section>
              )}

              {/* REQUIREMENTS */}
              {feature.requirements?.length > 0 && (
                <Section title="Requirements" icon={Shield} iconColor="text-blue-500" delay={0.2}>
                  <div className="p-4 bg-blue-50/40 border border-blue-100/50 rounded-2xl space-y-2.5">
                    <span className="text-[10px] font-bold text-blue-700 block">Before using {feature.name}:</span>
                    {feature.requirements.map((r, i) => <RequirementItem key={i} text={r} />)}
                  </div>
                </Section>
              )}

              {/* SUPPORTED CONNECTORS */}
              {feature.connectors?.length > 0 && (
                <Section title="Supported Connectors" icon={ExternalLink} iconColor="text-indigo-500" delay={0.25}>
                  <div className="flex flex-wrap gap-2">
                    {feature.connectors.map((c, i) => <ConnectorBadge key={i} name={c} />)}
                  </div>
                </Section>
              )}

              {/* AUTOMATIONS */}
              {feature.automations?.length > 0 && (
                <Section title="Supported Automations" icon={Zap} iconColor="text-amber-500" delay={0.3}>
                  <div className="space-y-1.5">
                    {feature.automations.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-slate-700 font-medium p-2 bg-slate-50 rounded-lg border border-slate-100">
                        <ChevronRight size={12} className="text-emerald-500 shrink-0" />
                        {a}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* AI CAPABILITIES */}
              {feature.aiCapabilities?.length > 0 && (
                <Section title="AI Capabilities" icon={Sparkles} iconColor="text-violet-500" delay={0.35}>
                  {feature.overview?.aiCapabilitiesSummary && (
                    <p className="text-[11px] text-violet-700 font-medium leading-relaxed bg-violet-50/50 p-3 rounded-xl border border-violet-100/60 mb-2">
                      {feature.overview.aiCapabilitiesSummary}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {feature.aiCapabilities.map((a, i) => <AIPill key={i} text={a} />)}
                  </div>
                </Section>
              )}

              {/* ANALYTICS */}
              {feature.analytics?.items?.length > 0 && (
                <Section title="Analytics" icon={BarChart3} iconColor="text-blue-500" delay={0.4}>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {feature.analytics.items.map((s, i) => <StatCard key={i} {...s} />)}
                  </div>
                </Section>
              )}

              {/* BEST PRACTICES */}
              {feature.bestPractices?.length > 0 && (
                <Section title="Best Practices" icon={Lightbulb} iconColor="text-emerald-500" delay={0.45}>
                  <div className="space-y-1.5">
                    {feature.bestPractices.map((b, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700 font-medium p-2.5 bg-emerald-50/40 rounded-xl border border-emerald-100/40">
                        <Lightbulb size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                        {b}
                      </div>
                    ))}
                  </div>
                </Section>
              )}

              {/* COMMON ERRORS */}
              {feature.commonErrors?.length > 0 && (
                <Section title="Common Errors & Troubleshooting" icon={AlertCircle} iconColor="text-red-500" delay={0.5}>
                  <div className="space-y-2">
                    {feature.commonErrors.map((e, i) => <ErrorCard key={i} {...e} />)}
                  </div>
                </Section>
              )}

              {/* DOCUMENTATION */}
              <Section title="Documentation & Help" icon={BookOpen} iconColor="text-blue-500" delay={0.55}>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={handleOpenGuide}
                    className="p-3 bg-slate-900 text-white border border-slate-800 rounded-xl text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
                  >
                    <BookOpen size={14} className="text-emerald-400" /> View Complete Guide
                  </button>
                  <button
                    onClick={handleOpenGuide}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <FileText size={14} className="text-blue-500" /> View Docs
                  </button>
                  <button
                    onClick={handleOpenGuide}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Play size={14} className="text-red-500" /> Video Tutorial
                  </button>
                  <button
                    onClick={() => { onClose(); router.push('/client/support'); }}
                    className="p-3 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <HelpCircle size={14} className="text-amber-500" /> Contact Support
                  </button>
                </div>
              </Section>

              {/* Bottom spacing */}
              <div className="h-4" />
            </div>

            {/* ── STICKY FOOTER ─────────────────────────────────────────── */}
            <div className="shrink-0 px-6 py-4 border-t border-slate-100 bg-white/90 backdrop-blur-md flex items-center gap-2.5">
              <button
                onClick={() => { onClose(); router.push(feature.path); }}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <Rocket size={14} /> Launch {feature.name}
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.aside>

          <style jsx>{`
            .custom-scroll::-webkit-scrollbar { width: 5px; }
            .custom-scroll::-webkit-scrollbar-track { background: transparent; }
            .custom-scroll::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 20px; }
            .custom-scroll::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
          `}</style>
        </>
      )}
    </AnimatePresence>
  );
};

export default FeatureDetailDrawer;

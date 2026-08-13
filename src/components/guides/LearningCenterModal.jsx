'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Search, BookOpen, CheckCircle, Circle, ChevronRight, ChevronDown,
  Copy, Check, Play, FileText, AlertTriangle, Lightbulb, Code2, Layers,
  Bookmark, ArrowLeft, ArrowRight, Printer, Share2, Rocket, HelpCircle,
  ExternalLink, Sparkles, Clock, Compass
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

// ── Copy Code Component ───────────────────────────────────────────────────────
const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-2xl bg-slate-950 border border-slate-800/80 overflow-hidden text-xs shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-slate-800/60 text-slate-400">
        <span className="font-mono text-[10px] uppercase font-bold text-emerald-400 tracking-wider">{language || 'code'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors cursor-pointer bg-slate-800/40 hover:bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700/60"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <pre className="p-4 text-slate-100 font-mono overflow-x-auto leading-relaxed text-[11px] bg-slate-950">
        <code>{code}</code>
      </pre>
    </div>
  );
};

// ── Interactive Checklist Component ─────────────────────────────────────────
const InteractiveChecklist = ({ items }) => {
  const [checkedState, setCheckedState] = useState(items || []);

  const toggleCheck = (idx) => {
    const next = [...checkedState];
    next[idx] = { ...next[idx], checked: !next[idx].checked };
    setCheckedState(next);
  };

  return (
    <div className="my-4 space-y-2.5 bg-slate-50/50 border border-slate-100 rounded-2xl p-5">
      {checkedState.map((item, idx) => (
        <motion.div
          whileHover={{ scale: 1.005, x: 2 }}
          whileTap={{ scale: 0.995 }}
          key={idx}
          onClick={() => toggleCheck(idx)}
          className={`flex items-start gap-3.5 p-3.5 bg-white border rounded-xl cursor-pointer shadow-xs transition-all ${item.checked ? 'border-emerald-100 bg-emerald-50/10' : 'border-slate-200/60 hover:border-emerald-300 hover:shadow-xs'
            }`}
        >
          <div className={`mt-0.5 w-4.5 h-4.5 rounded-lg border flex items-center justify-center transition-all ${item.checked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
            }`}>
            {item.checked && <Check size={12} strokeWidth={3} />}
          </div>
          <span className={`text-xs font-semibold tracking-wide ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
            {item.text || item}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// ── Step Content Renderer ─────────────────────────────────────────────────────
const StepContentRenderer = ({ step }) => {
  if (!step) return null;

  switch (step.step_type) {
    case 'code':
      return (
        <div className="space-y-2">
          {step.content && <p className="text-xs text-slate-600 leading-relaxed font-semibold">{step.content}</p>}
          <CodeBlock code={step.code_snippet || step.content} language={step.code_language} />
        </div>
      );

    case 'checklist':
      return (
        <div className="space-y-2">
          {step.content && <p className="text-xs text-slate-600 leading-relaxed font-semibold">{step.content}</p>}
          <InteractiveChecklist items={step.checklist_items} />
        </div>
      );

    case 'tip':
      return (
        <div className="my-4 p-4.5 bg-gradient-to-r from-emerald-50/60 to-teal-50/40 border border-emerald-200/50 rounded-2xl flex items-start gap-3.5 text-emerald-950 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
            <Lightbulb size={16} />
          </div>
          <div className="text-xs leading-relaxed font-semibold whitespace-pre-line pt-0.5">{step.content}</div>
        </div>
      );

    case 'warning':
      return (
        <div className="my-4 p-4.5 bg-gradient-to-r from-amber-50/60 to-orange-50/40 border border-amber-200/50 rounded-2xl flex items-start gap-3.5 text-amber-950 shadow-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0">
            <AlertTriangle size={16} />
          </div>
          <div className="text-xs leading-relaxed font-semibold whitespace-pre-line pt-0.5">{step.content}</div>
        </div>
      );

    case 'diagram':
      const parts = step.content.split('➔').map(p => p.trim());
      return (
        <div className="my-4 p-5 bg-slate-50 border border-slate-200/60 rounded-2xl shadow-xs">
          <div className="text-[9px] uppercase font-black text-slate-400 tracking-wider mb-4 text-center">Interactive Workflow Flowchart</div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-2 flex-wrap">
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                <div className="px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl shadow-xs text-xs font-bold text-slate-800 text-center min-w-[120px] max-w-[200px] hover:border-emerald-400 transition-colors">
                  {part}
                </div>
                {index < parts.length - 1 && (
                  <div className="text-slate-400 flex items-center justify-center py-1 sm:py-0">
                    <ArrowRight size={14} className="rotate-90 sm:rotate-0" />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="my-4 space-y-2">
          {step.media_url ? (
            <img src={step.media_url} alt={step.title} className="w-full rounded-2xl border border-slate-200 shadow-sm object-cover" />
          ) : (
            <div className="w-full h-48 bg-slate-100 rounded-2xl border border-dashed border-slate-300 flex items-center justify-center text-slate-400 text-xs font-semibold">
              Screenshot Placeholder
            </div>
          )}
          {step.content && <p className="text-xs text-slate-500 italic text-center">{step.content}</p>}
        </div>
      );

    default: // 'text'
      return (
        <p className="text-xs text-slate-700 leading-relaxed font-semibold whitespace-pre-line">
          {step.content}
        </p>
      );
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ── MAIN LEARNING CENTER MODAL ────────────────────────────────────────────────
// ═══════════════════════════════════════════════════════════════════════════════
const LearningCenterModal = ({ guideSlug, isOpen, onClose }) => {
  const router = useRouter();
  const [guide, setGuide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [completedStepIds, setCompletedStepIds] = useState([]);
  const [bookmarkedSections, setBookmarkedSections] = useState([]);
  const contentRef = useRef(null);

  useEffect(() => {
    if (!isOpen || !guideSlug) return;

    const fetchGuideDetails = async () => {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

      try {
        const [guideRes, progressRes] = await Promise.all([
          axios.get(`${API_URL}/api/guides/${guideSlug}/`, { headers }),
          axios.get(`${API_URL}/api/guides/progress/${guideSlug}/`, { headers }).catch(() => ({ data: null }))
        ]);

        if (guideRes.data) {
          setGuide(guideRes.data);
          if (guideRes.data.sections?.length > 0) {
            setActiveSectionId(guideRes.data.sections[0].id);
          }
        }

        if (progressRes.data) {
          setCompletedStepIds(progressRes.data.completed_steps || []);
          setBookmarkedSections(progressRes.data.bookmarked_sections || []);
        }
      } catch (err) {
        console.error('Error fetching guide:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGuideDetails();
  }, [guideSlug, isOpen]);

  // ESC key handler
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Scroll to top of content when chapter changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [activeSectionId]);

  // Toggle step completion
  const handleToggleStepComplete = async (stepId) => {
    const nextCompleted = completedStepIds.includes(stepId)
      ? completedStepIds.filter(id => id !== stepId)
      : [...completedStepIds, stepId];

    setCompletedStepIds(nextCompleted);

    const token = localStorage.getItem('token');
    if (!token) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

    try {
      await axios.post(
        `${API_URL}/api/guides/progress/${guideSlug}/`,
        { completed_steps: nextCompleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  // Toggle section bookmark
  const handleToggleBookmark = async (sectionId) => {
    const nextBookmarked = bookmarkedSections.includes(sectionId)
      ? bookmarkedSections.filter(id => id !== sectionId)
      : [...bookmarkedSections, sectionId];

    setBookmarkedSections(nextBookmarked);

    const token = localStorage.getItem('token');
    if (!token) return;
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

    try {
      await axios.post(
        `${API_URL}/api/guides/progress/${guideSlug}/`,
        { bookmarked_sections: nextBookmarked },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    } catch (err) {
      console.error('Error saving bookmark:', err);
    }
  };

  if (!isOpen) return null;

  // Calculate overall progress
  const allSteps = guide?.sections?.flatMap(s => s.steps || []) || [];
  const totalStepsCount = allSteps.length;
  const completedCount = allSteps.filter(s => completedStepIds.includes(s.id)).length;
  const progressPercent = totalStepsCount > 0 ? Math.round((completedCount / totalStepsCount) * 100) : 0;

  // Filter sections based on search query
  const filteredSections = guide?.sections?.filter(sec => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return sec.title.toLowerCase().includes(q) ||
      sec.steps?.some(st => (st.title || '').toLowerCase().includes(q) || (st.content || '').toLowerCase().includes(q));
  }) || [];

  const currentSection = guide?.sections?.find(s => s.id === activeSectionId) || guide?.sections?.[0];
  const currentSectionIndex = guide?.sections?.findIndex(s => s.id === activeSectionId) ?? 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="w-full h-full sm:h-[92vh] sm:max-w-6xl bg-white sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/80"
        >
          {/* ── HEADER BAR ───────────────────────────────────────────────── */}
          <div className="px-6 py-4.5 bg-white text-slate-900 flex items-center justify-between border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100/80 flex items-center justify-center text-emerald-700 shadow-xs">
                <BookOpen size={20} className="stroke-[2.5]" />
              </div>
              <div>
                <h2 className="text-base font-bold tracking-tight text-slate-900">
                  {guide?.title || 'Learning Guide'}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold mt-0.5">
                  <span className="flex items-center gap-1"><Clock size={13} className="text-slate-400" /> {guide?.estimated_time || '10 mins'}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-extrabold">{progressPercent}% Completed</span>
                </div>
              </div>
            </div>

            {/* Header Search & Close */}
            <div className="flex items-center gap-3">
              <div className="relative hidden md:block w-64">
                <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search in chapters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2 bg-slate-50 text-slate-900 placeholder-slate-400 text-xs rounded-xl border border-slate-200/80 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* ── MAIN TWO-COLUMN BODY ──────────────────────────────────────── */}
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400 gap-4">
              <div className="w-10 h-10 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-bold text-slate-600 tracking-wide">Loading Learning Guide...</span>
            </div>
          ) : (
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* ── LEFT SIDEBAR (280px) ─────────────────────────────────── */}
              <div className="w-full md:w-72 bg-slate-50 border-r border-slate-200 flex flex-col shrink-0 overflow-y-auto text-slate-700">

                {/* Progress Bar Header */}
                <div className="p-5 border-b border-slate-200 bg-white shrink-0">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                    <span>Course Progress</span>
                    <span className="text-emerald-600 font-extrabold">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-200/60">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Mobile Search */}
                <div className="p-4 md:hidden border-b border-slate-200 bg-white">
                  <div className="relative w-full">
                    <Search size={14} className="absolute left-3.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search in guide..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-1.5 bg-slate-50 text-slate-800 placeholder-slate-400 text-xs rounded-xl border border-slate-200"
                    />
                  </div>
                </div>

                {/* Chapter Sections List */}
                <div className="p-4 space-y-1.5">
                  <span className="px-3 py-1.5 text-[9px] font-black text-slate-400 uppercase tracking-widest block">
                    Learning Chapters ({filteredSections.length})
                  </span>

                  {filteredSections.map((sec, idx) => {
                    const isActive = sec.id === activeSectionId;
                    const isBookmarked = bookmarkedSections.includes(sec.id);
                    const secCompletedCount = sec.steps?.filter(st => completedStepIds.includes(st.id)).length || 0;
                    const isSecFullyCompleted = sec.steps?.length > 0 && secCompletedCount === sec.steps.length;

                    return (
                      <motion.button
                        whileHover={{ scale: 1.015, x: 2 }}
                        whileTap={{ scale: 0.985 }}
                        key={sec.id}
                        onClick={() => setActiveSectionId(sec.id)}
                        className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition-all flex items-start justify-between group cursor-pointer ${isActive
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 border border-emerald-500/10'
                            : 'hover:bg-slate-200/60 text-slate-600 hover:text-slate-900'
                          }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[10px] font-black shrink-0 ${isActive ? 'bg-emerald-700/50 text-white' : 'bg-slate-200 text-slate-500 group-hover:bg-slate-300/80 transition-colors'
                            }`}>
                            {idx + 1}
                          </span>
                          <div>
                            <span className="block leading-snug">{sec.title}</span>
                            <span className={`text-[10px] font-normal block mt-0.5 ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                              {sec.steps?.length || 0} Topics
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
                          {isSecFullyCompleted && (
                            <CheckCircle size={14} className={isActive ? 'text-white' : 'text-emerald-600'} />
                          )}
                          {isBookmarked && (
                            <Bookmark size={13} className={isActive ? 'text-emerald-200 fill-emerald-200' : 'text-amber-500 fill-amber-500'} />
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* ── RIGHT CONTENT AREA ────────────────────────────────────── */}
              <div ref={contentRef} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-slate-50/30">
                {currentSection ? (
                  <motion.div
                    key={currentSection.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                  >
                    {/* Chapter Header */}
                    <div className="pb-5 border-b border-slate-200/60 flex items-start justify-between gap-4 mb-6">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100/50 rounded-md text-[10px] font-bold uppercase tracking-widest">
                            Chapter {currentSectionIndex + 1} of {guide?.sections?.length || 1}
                          </span>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {currentSection.title}
                        </h1>
                      </div>

                      <button
                        onClick={() => handleToggleBookmark(currentSection.id)}
                        className={`p-2.5 rounded-xl border transition-all cursor-pointer ${bookmarkedSections.includes(currentSection.id)
                            ? 'bg-amber-50 border-amber-200 text-amber-600'
                            : 'bg-slate-50 border-slate-200 text-slate-400 hover:text-slate-700'
                          }`}
                        title="Bookmark Chapter"
                      >
                        <Bookmark size={16} className={bookmarkedSections.includes(currentSection.id) ? 'fill-amber-500' : ''} />
                      </button>
                    </div>

                    {/* Chapter Steps List */}
                    <div className="space-y-6">
                      {currentSection.steps?.map((step, sIdx) => {
                        const isCompleted = completedStepIds.includes(step.id);

                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: sIdx * 0.05 }}
                            key={step.id || sIdx}
                            className={`p-5.5 rounded-3xl border transition-all ${isCompleted
                                ? 'bg-slate-100/60 border-slate-200/50'
                                : 'bg-white border-slate-200 shadow-xs hover:border-slate-300/80 hover:shadow-xs'
                              }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-3.5">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleToggleStepComplete(step.id)}
                                  className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer ${isCompleted
                                      ? 'bg-emerald-600 border-emerald-600 text-white'
                                      : 'border-slate-300 hover:border-emerald-500 bg-white text-transparent'
                                    }`}
                                  title={isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                                >
                                  <Check size={14} strokeWidth={3} />
                                </button>

                                {step.title && (
                                  <h3 className={`text-sm font-bold tracking-tight ${isCompleted ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                                    {step.title}
                                  </h3>
                                )}
                              </div>

                              {step.step_type !== 'text' && (
                                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 px-2 py-0.5 bg-slate-50 border border-slate-200/40 rounded-md">
                                  {step.step_type}
                                </span>
                              )}
                            </div>

                            {/* Render step content */}
                            <StepContentRenderer step={step} />
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Prev / Next Section Navigation */}
                    <div className="mt-8 pt-6 border-t border-slate-200/60 flex items-center justify-between gap-4">
                      {currentSectionIndex > 0 ? (
                        <button
                          onClick={() => setActiveSectionId(guide.sections[currentSectionIndex - 1].id)}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-slate-200/60"
                        >
                          <ArrowLeft size={14} /> Previous Chapter
                        </button>
                      ) : <div />}

                      {currentSectionIndex < (guide?.sections?.length || 1) - 1 ? (
                        <button
                          onClick={() => setActiveSectionId(guide.sections[currentSectionIndex + 1].id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm shadow-emerald-600/20 cursor-pointer"
                        >
                          Next Chapter <ArrowRight size={14} />
                        </button>
                      ) : (
                        <button
                          onClick={onClose}
                          className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-slate-950/20"
                        >
                          Complete & Exit Academy <Check size={14} />
                        </button>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-16 text-slate-400 text-xs">
                    Select a learning chapter from the left sidebar.
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LearningCenterModal;

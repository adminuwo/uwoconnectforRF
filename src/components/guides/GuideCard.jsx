'use client';

import React from 'react';
import {
  BookOpen, Clock, ArrowRight, CheckCircle2, ChevronRight,
  Zap, Megaphone, Link2, GitBranch, Settings, LayoutDashboard,
  Video, Database, MessageSquare, Brain
} from 'lucide-react';

const ICON_MAP = {
  Link2, Megaphone, GitBranch, Settings, LayoutDashboard,
  Video, Database, MessageSquare, Brain, BookOpen
};

const GuideCard = ({ guide, onOpenGuide, progress = 0 }) => {
  const IconComponent = ICON_MAP[guide.icon] || BookOpen;

  return (
    <div
      onClick={() => onOpenGuide(guide.slug)}
      className="p-6 bg-white border border-slate-200/80 rounded-3xl hover:border-emerald-500/60 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer group flex flex-col justify-between relative overflow-hidden"
    >
      {/* Top Background Glow */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all pointer-events-none" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-slate-900 text-emerald-400 border border-slate-800 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
            <IconComponent size={22} />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg border border-slate-200">
            {guide.category || 'Academy'}
          </span>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors tracking-tight mb-2">
          {guide.title}
        </h3>
        <p className="text-xs text-slate-500 font-medium leading-relaxed line-clamp-2 mb-4">
          {guide.description}
        </p>
      </div>

      {/* Footer Info & Progress */}
      <div className="pt-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
          <span className="flex items-center gap-1.5"><Clock size={13} className="text-slate-400" /> {guide.estimated_time || '10 mins'}</span>
          <span>{guide.total_sections || 0} Chapters</span>
        </div>

        {/* Action Button */}
        <div className="w-full py-2.5 px-4 bg-slate-50 group-hover:bg-emerald-600 group-hover:text-white text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center justify-between shadow-xs">
          <span>View Complete Guide</span>
          <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};

export default GuideCard;

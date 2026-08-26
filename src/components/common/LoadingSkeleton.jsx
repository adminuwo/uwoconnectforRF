'use client';

import React from 'react';
import { Loader2, Sparkles, Users, Layers, CheckSquare, Shield } from 'lucide-react';

/**
 * Basic Shimmer Pulse Block
 */
export function SkeletonBlock({ className = '' }) {
  return (
    <div className={`bg-gradient-to-r from-slate-100 via-slate-200/80 to-slate-100 animate-pulse rounded-2xl ${className}`} />
  );
}

/**
 * Modern Center Spinner with Glowing Ring
 */
export function ModernSpinner({ label = 'Loading...', size = 'md', className = '' }) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 space-y-3 ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Glowing blur background */}
        <div className="absolute inset-0 rounded-full bg-emerald-500/20 blur-xl animate-pulse" />
        
        {/* Outer Spinning Ring */}
        <div className={`${sizeMap[size]} rounded-full border-3 border-emerald-100 border-t-emerald-600 animate-spin`} />
        
        {/* Inner static icon */}
        <div className="absolute inset-0 flex items-center justify-center text-emerald-600">
          <Sparkles size={size === 'lg' ? 22 : size === 'md' ? 16 : 12} className="animate-pulse" />
        </div>
      </div>

      {label && (
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
          <span>{label}</span>
          <span className="flex gap-0.5">
            <span className="w-1 h-1 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-emerald-600 animate-bounce" />
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton Member Cards for Directory
 */
export function SkeletonMemberCards({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 relative overflow-hidden">
          {/* Subtle Top shimmer line */}
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent animate-pulse" />

          {/* Header row: Avatar + Name + Status pill */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="w-12 h-12 rounded-2xl shrink-0" />
              <div className="space-y-1.5 min-w-[120px]">
                <SkeletonBlock className="h-4 w-28 rounded-md" />
                <SkeletonBlock className="h-3 w-20 rounded-md" />
              </div>
            </div>
            <SkeletonBlock className="w-14 h-5 rounded-full" />
          </div>

          {/* Contact Details rows */}
          <div className="bg-slate-50/70 p-3.5 rounded-2xl border border-slate-100 space-y-2">
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-12 rounded-md" />
              <SkeletonBlock className="h-3 w-32 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-14 rounded-md" />
              <SkeletonBlock className="h-3 w-24 rounded-md" />
            </div>
            <div className="flex items-center justify-between">
              <SkeletonBlock className="h-3 w-16 rounded-md" />
              <SkeletonBlock className="h-3 w-16 rounded-md" />
            </div>
          </div>

          {/* Channels Placeholder */}
          <div className="space-y-1.5 pt-1">
            <SkeletonBlock className="h-2.5 w-24 rounded-md" />
            <div className="flex gap-2">
              <SkeletonBlock className="h-5 w-20 rounded-lg" />
              <SkeletonBlock className="h-5 w-24 rounded-lg" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
            <SkeletonBlock className="h-9 flex-1 rounded-xl" />
            <SkeletonBlock className="h-9 flex-1 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton Project Cards
 */
export function SkeletonProjectCards({ count = 3 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1.5">
              <SkeletonBlock className="h-4 w-36 rounded-md" />
              <SkeletonBlock className="h-3 w-24 rounded-md" />
            </div>
            <SkeletonBlock className="w-16 h-6 rounded-full" />
          </div>

          <SkeletonBlock className="h-10 w-full rounded-xl" />

          <div className="space-y-2">
            <div className="flex justify-between">
              <SkeletonBlock className="h-3 w-16 rounded-md" />
              <SkeletonBlock className="h-3 w-8 rounded-md" />
            </div>
            <SkeletonBlock className="h-2 w-full rounded-full" />
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-100">
            <div className="flex -space-x-2">
              <SkeletonBlock className="w-7 h-7 rounded-full" />
              <SkeletonBlock className="w-7 h-7 rounded-full" />
              <SkeletonBlock className="w-7 h-7 rounded-full" />
            </div>
            <SkeletonBlock className="h-3 w-20 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton Task Kanban Columns
 */
export function SkeletonTaskKanban() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-in fade-in duration-300">
      {['To Do', 'In Progress', 'Completed'].map((col, idx) => (
        <div key={idx} className="bg-slate-50/80 p-4 rounded-3xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <SkeletonBlock className="h-4 w-24 rounded-md" />
            <SkeletonBlock className="h-5 w-6 rounded-full" />
          </div>
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
              <div className="flex justify-between">
                <SkeletonBlock className="h-3.5 w-32 rounded-md" />
                <SkeletonBlock className="h-4 w-12 rounded-md" />
              </div>
              <SkeletonBlock className="h-3 w-full rounded-md" />
              <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                <SkeletonBlock className="w-6 h-6 rounded-full" />
                <SkeletonBlock className="h-3 w-16 rounded-md" />
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton Table Rows
 */
export function SkeletonTableRows({ rows = 5, cols = 5 }) {
  return (
    <div className="divide-y divide-slate-100 animate-in fade-in duration-300">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="p-4 flex items-center justify-between gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <SkeletonBlock 
              key={c} 
              className={`h-4 rounded-md ${c === 0 ? 'w-36' : c === 1 ? 'w-24' : 'w-20'}`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

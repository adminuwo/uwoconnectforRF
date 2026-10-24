'use client';

import React from 'react';
import { Check, X, Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import { evaluatePassword } from '@/lib/passwordValidation';

export default function PasswordStrengthIndicator({
  password = '',
  confirmPassword = null,
  showChecklist = true,
  showConfirmIndicator = false,
  className = '',
}) {
  const evaluation = evaluatePassword(password, confirmPassword);
  const { requirements, strength, score, metCount, totalCount, isValid } = evaluation;

  // Don't show checklist until user starts typing or when explicitly always shown
  const hasTyped = Boolean(password && password.length > 0);

  return (
    <div className={`w-full space-y-3 pt-1 select-none transition-all ${className}`} aria-live="polite">
      {/* ── Strength Bar & Label Row ── */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
            {isValid ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : score > 1 ? (
              <Shield className="w-3.5 h-3.5 text-blue-500 shrink-0" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            Strength:
            <span className={`font-bold ml-0.5 ${hasTyped ? strength.textColor : 'text-slate-400'}`}>
              {hasTyped ? strength.label : 'Enter a password'}
            </span>
          </span>
          <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
            {metCount}/{totalCount} requirements
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex gap-1 p-0.5">
          {[1, 2, 3, 4].map((step) => {
            const isStepActive = hasTyped && score >= step;
            return (
              <div
                key={step}
                className={`h-full flex-1 rounded-full transition-all duration-300 ${
                  isStepActive
                    ? strength.tailwindColor
                    : 'bg-slate-200 dark:bg-slate-700'
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* ── Live Checklist ── */}
      {showChecklist && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 rounded-xl p-2.5">
          {requirements.map((req) => {
            const isMet = req.met;
            return (
              <div
                key={req.id}
                className={`flex items-center gap-2 text-[11px] font-medium transition-colors ${
                  isMet
                    ? 'text-emerald-700 dark:text-emerald-400'
                    : 'text-slate-400 dark:text-slate-500'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                    isMet
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  {isMet ? (
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  ) : (
                    <span className="w-1 h-1 rounded-full bg-slate-400" />
                  )}
                </div>
                <span>{req.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Confirm Password Match Feedback ── */}
      {showConfirmIndicator && confirmPassword !== null && confirmPassword !== undefined && confirmPassword.length > 0 && (
        <div
          className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
            evaluation.confirmMatches
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
              : 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
          }`}
        >
          {evaluation.confirmMatches ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Passwords match</span>
            </>
          ) : (
            <>
              <X className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Passwords do not match</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

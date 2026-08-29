'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { X, Zap, ShieldCheck, ChevronRight, Lock } from 'lucide-react';
import { useEntitlement } from '@/context/EntitlementContext';

export default function UpgradeModal() {
  const router = useRouter();
  const { upgradeModal, closeUpgradeModal, entitlements } = useEntitlement();

  if (!upgradeModal || !upgradeModal.isOpen) return null;

  const currentPlanName = entitlements?.plan?.name || 'Starter';
  const { itemName, itemType, requiredPlan } = upgradeModal;

  const handleNavigatePlans = () => {
    closeUpgradeModal();
    router.push('/client/plans');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800">

        {/* Top Gradient Banner */}
        <div className="h-3 bg-gradient-to-r from-violet-600 via-indigo-600 to-pink-500" />

        {/* Close Button */}
        <button
          onClick={closeUpgradeModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="p-6 md:p-8 space-y-6">

          {/* Header Icon & Title */}
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400 shrink-0">
              <Lock size={24} />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-50 text-violet-700 border border-violet-200 dark:bg-violet-950/80 dark:text-violet-300 dark:border-violet-800">
                <Zap size={12} /> Plan Upgrade Required
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                Unlock {itemName}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                This {itemType} is not available on your current <span className="font-semibold text-slate-700 dark:text-slate-300">{currentPlanName}</span> plan.
              </p>
            </div>
          </div>

          {/* Upgrade Path Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 dark:bg-slate-850 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider">
              <span>Current Plan</span>
              <span>Available From</span>
            </div>
            <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-100">
              <span className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg dark:bg-slate-800 dark:text-slate-300 text-sm">
                {currentPlanName}
              </span>
              <ChevronRight size={18} className="text-slate-400" />
              <span className="px-3 py-1 bg-violet-600 text-white rounded-lg text-sm shadow-sm">
                {requiredPlan} Plan
              </span>
            </div>
          </div>

          {/* Benefits Bullet Points */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Upgrading to {requiredPlan} gives you:
            </h4>
            <ul className="text-sm text-slate-600 dark:text-slate-300 space-y-1.5">
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Access to {itemName} & higher channel limits</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Advanced multi-channel workflow automations</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
                <span>Unlimited contacts & priority rate limits</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={closeUpgradeModal}
              className="flex-1 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-800"
            >
              Maybe Later
            </button>
            <button
              onClick={handleNavigatePlans}
              className="flex-1 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 rounded-xl shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-1.5"
            >
              <Zap size={16} /> Upgrade Plan
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

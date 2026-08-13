'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, XCircle, Loader2, CreditCard } from 'lucide-react';

/**
 * OAuth Callback Page — /client/payments/callback
 * Handles the Razorpay OAuth redirect.
 * The backend already processes the code and redirects here with:
 *   ?razorpay_status=connected  or  ?razorpay_status=error&message=...
 *
 * This page is just a visual intermediary — it reads the result
 * and redirects to /client/payments after a brief confirmation screen.
 */
export default function RazorpayCallbackPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();

  const [status, setStatus]   = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const razorpayStatus = searchParams.get('razorpay_status');
    const errorMessage   = searchParams.get('message') || 'Unknown error';

    if (razorpayStatus === 'connected') {
      setStatus('success');
      setTimeout(() => router.replace('/client/payments?razorpay_status=connected'), 2000);
    } else if (razorpayStatus === 'error') {
      setStatus('error');
      setMessage(errorMessage.replace(/_/g, ' '));
      setTimeout(() => router.replace('/client/payments'), 3500);
    } else {
      // No params — redirect immediately
      router.replace('/client/payments');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full mx-4 text-center">
        {status === 'loading' && (
          <>
            <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-xl font-black text-slate-800">Connecting…</h2>
            <p className="text-sm text-slate-400 mt-2">Please wait while we connect your Razorpay account.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Connected!</h2>
            <p className="text-sm text-slate-500 mt-2">Your Razorpay account has been connected successfully. Redirecting…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle size={36} className="text-red-500" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Connection Failed</h2>
            <p className="text-sm text-slate-500 mt-2 capitalize">{message}</p>
            <p className="text-xs text-slate-400 mt-3">Redirecting back…</p>
          </>
        )}
      </div>
    </div>
  );
}

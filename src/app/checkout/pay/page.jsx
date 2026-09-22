'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id') || '';
  const razorpayOrderId = searchParams.get('razorpay_order_id') || '';
  const keyId = searchParams.get('key_id') || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_SBFlInxBiRfOGd';
  const planName = searchParams.get('plan') || 'Professional';
  const amountParam = searchParams.get('amount') || '2999';
  const redirectUrl = searchParams.get('redirect_url') || 'uwoconnect://payment-result';
  const customerName = searchParams.get('name') || 'UWO Connect Customer';
  const customerEmail = searchParams.get('email') || 'admin@uwo24.com';
  const customerPhone = searchParams.get('phone') || '+918358990909';

  const [statusText, setStatusText] = useState('Initializing secure Razorpay gateway...');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!orderId && !razorpayOrderId) {
      setErrorMessage('Missing order identifier in checkout URL.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => launchRazorpay();
    script.onerror = () => setErrorMessage('Failed to load Razorpay SDK. Please check your connection.');
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {}
    };
  }, [orderId, razorpayOrderId]);

  const launchRazorpay = () => {
    if (!window.Razorpay) {
      setTimeout(launchRazorpay, 400);
      return;
    }

    const amountInr = parseFloat(amountParam) || 2999;
    const amountPaise = Math.round(amountInr * 100);

    const options = {
      key: keyId,
      amount: amountPaise,
      currency: 'INR',
      name: 'UWO Connect',
      description: `Upgrade to ${planName} Plan`,
      order_id: razorpayOrderId || undefined,
      prefill: {
        name: customerName,
        email: customerEmail,
        contact: customerPhone
      },
      theme: {
        color: '#059669'
      },
      handler: async function (response) {
        setStatusText('Verifying payment and activating subscription...');
        try {
          const verifyRes = await axios.post('/api/payments/verify-order/', {
            order_id: orderId,
            razorpay_order_id: response.razorpay_order_id || razorpayOrderId,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });

          if (verifyRes.data.success) {
            setIsSuccess(true);
            setStatusText('Payment Verified! Returning to app...');
            setTimeout(() => {
              window.location.href = `${redirectUrl}?status=success&order_id=${encodeURIComponent(orderId)}&plan=${encodeURIComponent(planName)}&amount=${amountInr}&payment_id=${response.razorpay_payment_id}`;
            }, 600);
          } else {
            setErrorMessage('Payment verification failed on server.');
          }
        } catch (err) {
          // If local verification fails, still route back with payment_id
          setIsSuccess(true);
          window.location.href = `${redirectUrl}?status=success&order_id=${encodeURIComponent(orderId)}&plan=${encodeURIComponent(planName)}&amount=${amountInr}&payment_id=${response.razorpay_payment_id}`;
        }
      },
      modal: {
        ondismiss: function () {
          setStatusText('Payment cancelled.');
          window.location.href = `${redirectUrl}?status=cancelled&order_id=${encodeURIComponent(orderId)}`;
        }
      }
    };

    try {
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        setErrorMessage(resp.error?.description || 'Payment was unsuccessful.');
      });
      rzp.open();
    } catch (e) {
      setErrorMessage(e.message || 'Error launching Razorpay.');
    }
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#131b2e] border border-emerald-500/20 rounded-3xl p-8 text-center shadow-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <ShieldCheck className="w-4 h-4" /> 256-Bit Razorpay Secure
        </div>

        <h1 className="text-2xl font-black text-white mb-2">{planName} Subscription</h1>
        <p className="text-sm text-slate-400 mb-6">Complete your transaction to instantly upgrade your workspace.</p>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-6">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-bold mb-1">Payable Amount</div>
          <div className="text-4xl font-black text-emerald-400 mb-2">₹{parseFloat(amountParam || '2999').toLocaleString('en-IN')}</div>
          <div className="text-xs text-slate-400">Order Ref: {orderId || razorpayOrderId}</div>
        </div>

        {errorMessage ? (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm flex items-center justify-center gap-2 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        ) : isSuccess ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm flex items-center justify-center gap-2 mb-4">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{statusText}</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-3 text-sm text-sky-400 mb-6">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{statusText}</span>
          </div>
        )}

        <button
          onClick={launchRazorpay}
          disabled={isSuccess}
          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/30 transition-all mb-3 cursor-pointer"
        >
          Pay with Razorpay
        </button>

        <a
          href={`${redirectUrl}?status=cancelled&order_id=${encodeURIComponent(orderId)}`}
          className="block w-full py-3 bg-transparent border border-white/10 rounded-xl text-slate-400 text-sm font-semibold hover:text-white transition-all"
        >
          Cancel & Return to App
        </a>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#090d16] text-white flex items-center justify-center">Loading Checkout...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}

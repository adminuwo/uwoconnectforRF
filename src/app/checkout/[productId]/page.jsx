'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  ShoppingBag, Shield, CheckCircle2, XCircle, Loader2,
  IndianRupee, Star, Lock, CreditCard, Phone, Mail, User,
  AlertCircle, ArrowLeft, Package
} from 'lucide-react';
import axios from 'axios';

import { API_BASE_URL } from '@/config/apiConfig';

const API = () => API_BASE_URL;

const formatCurrency = (amount, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);

// Razorpay checkout loader
function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      return resolve(true);
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function PublicCheckoutPage() {
  const params    = useParams();
  const productId = params.productId;

  const [productData, setProductData] = useState(null);
  const [loading, setLoading]         = useState(true);
  const [paymentStep, setPaymentStep] = useState('form'); // form | processing | success | error
  const [paymentResult, setPaymentResult] = useState(null);

  const [form, setForm] = useState({
    customer_name:  '',
    customer_email: '',
    customer_phone: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!productId) return;
    axios.get(`${API()}/api/public/checkout/${productId}`)
      .then(res => setProductData(res.data))
      .catch(() => setProductData({ error: 'Product not found.' }))
      .finally(() => setLoading(false));
  }, [productId]);

  const validate = () => {
    const errs = {};
    if (!form.customer_name.trim()) errs.customer_name = 'Name is required';
    if (!form.customer_email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customer_email))
      errs.customer_email = 'Valid email is required';
    if (!form.customer_phone.trim() || form.customer_phone.length < 10)
      errs.customer_phone = 'Valid phone number is required';
    return errs;
  };

  const handlePay = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      // Step 1: Load Razorpay SDK
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded) {
        setPaymentStep('error');
        setPaymentResult({ message: 'Failed to load Razorpay SDK. Please check your connection.' });
        return;
      }

      // Step 2: Create order on backend (uses the SELLER's Razorpay account)
      const orderRes = await axios.post(`${API()}/api/razorpay/checkout/create-order`, {
        product_id:      productId,
        customer_name:   form.customer_name,
        customer_email:  form.customer_email,
        customer_phone:  form.customer_phone,
      });

      const {
        razorpay_order_id,
        razorpay_key_id,
        amount,
        currency,
        payment_record_id,
        product_name,
        workspace_name,
      } = orderRes.data;

      setPaymentStep('processing');

      // Step 3: Open Razorpay checkout using the SELLER's key_id
      const options = {
        key:         razorpay_key_id,
        amount:      amount,
        currency:    currency || 'INR',
        name:        workspace_name || 'Store',
        description: product_name,
        order_id:    razorpay_order_id,
        prefill: {
          name:    form.customer_name,
          email:   form.customer_email,
          contact: form.customer_phone,
        },
        theme: { color: '#3B82F6' },
        modal: {
          ondismiss: () => {
            setPaymentStep('form');
            setSubmitting(false);
          },
        },
        handler: async function(response) {
          // Step 4: Verify payment on backend
          try {
            const verifyRes = await axios.post(`${API()}/api/razorpay/checkout/verify`, {
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              payment_record_id:   payment_record_id,
            });

            if (verifyRes.data.success) {
              setPaymentStep('success');
              setPaymentResult(verifyRes.data);
            } else {
              setPaymentStep('error');
              setPaymentResult({ message: verifyRes.data.message || 'Payment verification failed.' });
            }
          } catch (err) {
            setPaymentStep('error');
            setPaymentResult({ message: 'Payment verification error. Please contact support.' });
          }
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function(response) {
        setPaymentStep('error');
        setPaymentResult({ message: response.error?.description || 'Payment failed.' });
        setSubmitting(false);
      });
      rzp.open();

    } catch (err) {
      const errMsg = err?.response?.data?.error || 'Failed to initiate payment. Please try again.';
      setPaymentStep('error');
      setPaymentResult({ message: errMsg });
      setSubmitting(false);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-blue-500" />
      </div>
    );
  }

  // ─── Not found / error ────────────────────────────────────────────────────
  if (!productData || productData.error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center">
          <Package size={48} className="text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-800 mb-2">Product Not Found</h2>
          <p className="text-sm text-slate-500">{productData?.error || 'This product does not exist or has been removed.'}</p>
        </div>
      </div>
    );
  }

  const { product, workspace, payment_enabled, payment_error } = productData;

  // ─── Success Screen ───────────────────────────────────────────────────────
  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={44} className="text-emerald-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Payment Successful!</h2>
          <p className="text-slate-500 mb-6">
            Thank you <strong>{form.customer_name}</strong>! Your payment has been confirmed.
          </p>
          <div className="bg-emerald-50 rounded-2xl p-5 text-left space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Product</span>
              <span className="font-bold">{product.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-black text-emerald-700">{formatCurrency(paymentResult?.amount || product.price, product.currency)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Payment ID</span>
              <span className="font-mono text-xs text-slate-600">{paymentResult?.payment_id}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Email</span>
              <span className="font-medium">{form.customer_email}</span>
            </div>
          </div>
          <p className="text-xs text-slate-400">A confirmation will be sent to your email address.</p>
        </div>
      </div>
    );
  }

  // ─── Error Screen ─────────────────────────────────────────────────────────
  if (paymentStep === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={36} className="text-red-500" />
          </div>
          <h2 className="text-xl font-black text-slate-800 mb-2">Payment Failed</h2>
          <p className="text-sm text-slate-500 mb-6">{paymentResult?.message || 'Something went wrong.'}</p>
          <button
            onClick={() => { setPaymentStep('form'); setSubmitting(false); }}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ─── Processing Screen ────────────────────────────────────────────────────
  if (paymentStep === 'processing') {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-sm w-full text-center">
          <Loader2 size={48} className="animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-slate-800">Processing Payment</h2>
          <p className="text-sm text-slate-400 mt-2">Please complete the payment in the Razorpay window.</p>
        </div>
      </div>
    );
  }

  // ─── Main Checkout Form ───────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-slate-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} className="text-blue-600" />
            <span className="font-black text-slate-800 text-sm">{workspace?.name || 'Store'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Lock size={12} className="text-emerald-500" />
            <span>Secured by Razorpay</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-8">

          {/* ── Product Card (left) ── */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              {/* Product image */}
              <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={64} className="text-slate-200" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {product.category} {product.brand ? `· ${product.brand}` : ''}
                </p>
                <h1 className="text-xl font-black text-slate-900 mb-2 leading-tight">{product.name}</h1>
                {product.description && (
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{product.description}</p>
                )}

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-4">
                  <p className="text-3xl font-black text-slate-900">
                    {formatCurrency(product.price, product.currency)}
                  </p>
                  <p className="text-sm text-slate-400">{product.currency}</p>
                </div>

                {/* Trust badges */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Shield, text: 'Secure Payment' },
                    { icon: Lock, text: 'Encrypted' },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-1 bg-slate-50 rounded-lg px-2.5 py-1.5">
                      <Icon size={10} className="text-emerald-500" />
                      <span className="text-[10px] font-bold text-slate-500">{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Checkout Form (right) ── */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
              <h2 className="text-xl font-black text-slate-900 mb-1">Complete Purchase</h2>
              <p className="text-sm text-slate-400 mb-8">Enter your details to proceed with payment</p>

              {!payment_enabled && (
                <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                  <AlertCircle size={18} className="text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-amber-800 font-medium">
                    {payment_error || 'Online payment is not available for this product.'}
                  </p>
                </div>
              )}

              <div className="space-y-5">
                {/* Name */}
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Rahul Sharma"
                      value={form.customer_name}
                      onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                        errors.customer_name
                          ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {errors.customer_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={form.customer_email}
                      onChange={e => setForm(f => ({ ...f, customer_email: e.target.value }))}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                        errors.customer_email
                          ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {errors.customer_email && (
                    <p className="text-xs text-red-500 mt-1">{errors.customer_email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.customer_phone}
                      onChange={e => setForm(f => ({ ...f, customer_phone: e.target.value }))}
                      className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium outline-none transition-all ${
                        errors.customer_phone
                          ? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-red-200'
                          : 'border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
                      }`}
                    />
                  </div>
                  {errors.customer_phone && (
                    <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>
                  )}
                </div>

                {/* Order Summary */}
                <div className="bg-slate-50 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Product</span>
                    <span className="font-bold text-slate-700">{product.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Price</span>
                    <span className="font-bold">{formatCurrency(product.price, product.currency)}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 flex justify-between">
                    <span className="font-black text-slate-800">Total</span>
                    <span className="font-black text-blue-600 text-lg">
                      {formatCurrency(product.price, product.currency)}
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePay}
                  disabled={submitting || !payment_enabled}
                  className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl text-base font-black transition-all shadow-lg ${
                    payment_enabled && !submitting
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {submitting ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <CreditCard size={20} />
                  )}
                  {submitting
                    ? 'Redirecting to Razorpay…'
                    : payment_enabled
                    ? `Pay ${formatCurrency(product.price, product.currency)}`
                    : 'Payment Not Available'}
                </button>

                {payment_enabled && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <Lock size={11} className="text-emerald-500" />
                    <span>Your payment is secured and encrypted by Razorpay</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

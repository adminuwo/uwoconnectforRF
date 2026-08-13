'use client';

import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Loader2, Sparkles, Building2, User, Mail, Phone, FileText, Calculator, CreditCard, Upload, ShoppingBag, ShoppingCart, RefreshCw, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function InvoiceCreateModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(false);
  const [toast, setToast] = useState(null);

  // Company Branding States
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyGstin, setCompanyGstin] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');

  // Mode Selection: 'MANUAL' or 'ORDER'
  const [invoiceMode, setInvoiceMode] = useState('ORDER');

  // Catalogs & Orders Lists
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState('');

  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerAddress, setCustomerAddress] = useState('');
  const [customerGstin, setCustomerGstin] = useState('');

  // Invoice Meta Details
  const [paymentStatus, setPaymentStatus] = useState('PAID');
  const [paymentMethod, setPaymentMethod] = useState('Card/Online');
  const [transactionId, setTransactionId] = useState('');
  const [orderReference, setOrderReference] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [dueDate, setDueDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  
  const [currency, setCurrency] = useState('INR');
  const [currencySymbol, setCurrencySymbol] = useState('₹');

  // Line items
  const [items, setItems] = useState([
    { name: '', sku: '', quantity: 1, unit_price: 1000, tax_rate: 18 }
  ]);

  const currencyMap = {
    'INR': '₹',
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'AED': 'AED',
    'SAR': 'SAR',
    'AUD': 'A$',
    'CAD': 'C$',
    'SGD': 'S$',
    'JPY': '¥',
  };

  const handleCurrencyChange = (code) => {
    setCurrency(code);
    setCurrencySymbol(currencyMap[code] || '$');
  };

  // Fetch Client Profile & Connected Catalog / Orders
  useEffect(() => {
    const loadInitialData = async () => {
      setFetchingData(true);
      const token = localStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };

      try {
        // 1. Fetch Client Profile (Company Branding)
        const profileRes = await axios.get(`${API_BASE_URL}/api/profile`, { headers }).catch(() => null);
        if (profileRes?.data) {
          const clientData = profileRes.data.client || {};
          setCompanyName(clientData.business_name || '');
          setCompanyLogoUrl(clientData.company_logo_url || '');
          setCompanyPhone(clientData.phone_number || '');
          setCompanyAddress(clientData.address || '');
          setCompanyGstin(clientData.tax_id_gstin || '');
          if (profileRes.data.user?.email) setCompanyEmail(profileRes.data.user.email);
        }

        // 2. Fetch Catalog Products
        const prodRes = await axios.get(`${API_BASE_URL}/api/products/`, { headers }).catch(() => null);
        if (prodRes?.data) {
          const prodList = Array.isArray(prodRes.data) ? prodRes.data : prodRes.data.results || [];
          setProducts(prodList);
        }

        // 3. Fetch Workspace Orders
        const orderRes = await axios.get(`${API_BASE_URL}/api/orders/`, { headers }).catch(() => null);
        if (orderRes?.data) {
          const orderList = Array.isArray(orderRes.data) ? orderRes.data : orderRes.data.results || [];
          setOrders(orderList);
        }
      } catch (err) {
        console.error("Error loading invoice initial data:", err);
      } finally {
        setFetchingData(false);
      }
    };

    if (isOpen) {
      loadInitialData();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Logo Image Upload
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("Logo image size should be under 5MB.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setCompanyLogoUrl(reader.result);
      showToast("Company logo updated! It will be saved to your profile.");
    };
    reader.readAsDataURL(file);
  };

  // Product Selection Handler
  const handleSelectProduct = (productId) => {
    setSelectedProductId(productId);
    if (!productId) return;

    const prod = products.find(p => String(p.id) === String(productId));
    if (prod) {
      // Auto-populate item
      const newItems = [{
        name: prod.name || prod.title || 'Product',
        sku: prod.sku || '',
        quantity: 1,
        unit_price: Number(prod.price || prod.unit_price || 0),
        tax_rate: Number(prod.gst_rate || prod.tax_rate || 18)
      }];
      setItems(newItems);

      if (prod.currency) {
        handleCurrencyChange(prod.currency);
      }
    }
  };

  // Order Selection Handler
  const handleSelectOrder = (orderId) => {
    setSelectedOrderId(orderId);
    if (!orderId) return;

    const ord = orders.find(o => String(o.id) === String(orderId));
    if (ord) {
      // Auto-populate Customer Details
      setCustomerName(ord.customer_name || ord.contact_name || ord.billing_name || 'Valued Customer');
      setCustomerEmail(ord.customer_email || ord.contact_email || ord.email || '');
      setCustomerPhone(ord.customer_phone || ord.contact_phone || ord.phone || '');
      setCustomerAddress(ord.billing_address || ord.shipping_address || ord.address || '');
      
      // Auto-populate Order & Payment Meta
      setOrderReference(ord.order_number || ord.order_id || `#ORD-${ord.id}`);
      setPaymentStatus(ord.payment_status ? ord.payment_status.toUpperCase() : 'PAID');
      if (ord.payment_method) setPaymentMethod(ord.payment_method);
      if (ord.transaction_id || ord.payment_id) setTransactionId(ord.transaction_id || ord.payment_id);

      if (ord.currency) {
        handleCurrencyChange(ord.currency);
      }

      // Auto-populate Items if order has items or product
      if (ord.items && ord.items.length > 0) {
        setItems(ord.items.map(i => ({
          name: i.name || i.product_name || 'Product Item',
          sku: i.sku || '',
          quantity: Number(i.quantity || 1),
          unit_price: Number(i.unit_price || i.price || 0),
          tax_rate: Number(i.tax_rate || 18)
        })));
      } else if (ord.product_name || ord.title) {
        setItems([{
          name: ord.product_name || ord.title,
          sku: ord.sku || '',
          quantity: Number(ord.quantity || 1),
          unit_price: Number(ord.total_amount || ord.amount || 0),
          tax_rate: 18
        }]);
      }
    }
  };

  // Filter orders by selected product
  const filteredOrders = selectedProductId 
    ? orders.filter(o => String(o.product_id) === String(selectedProductId) || (o.items && o.items.some(i => String(i.product_id) === String(selectedProductId))))
    : orders;

  const handleAddItem = () => {
    setItems([...items, { name: '', sku: '', quantity: 1, unit_price: 0, tax_rate: 18 }]);
  };

  const handleRemoveItem = (idx) => {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx, field, value) => {
    const copy = [...items];
    copy[idx][field] = value;
    setItems(copy);
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let taxTotal = 0;
    items.forEach(item => {
      const base = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
      const tax = base * ((Number(item.tax_rate) || 0) / 100);
      subtotal += base;
      taxTotal += tax;
    });
    const total = subtotal + taxTotal;
    return { subtotal, taxTotal, total };
  };

  const { subtotal, taxTotal, total } = calculateTotals();

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !customerEmail) {
      alert('Customer Name and Email are required.');
      return;
    }
    if (items.some(i => !i.name)) {
      alert('All line items must have an Item Name.');
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('token');

    const formattedItems = items.map(i => {
      const base = (Number(i.quantity) || 1) * (Number(i.unit_price) || 0);
      const gst = base * ((Number(i.tax_rate) || 0) / 100);
      return {
        name: i.name,
        sku: i.sku || '',
        quantity: Number(i.quantity) || 1,
        unit_price: Number(i.unit_price) || 0,
        tax_rate: Number(i.tax_rate) || 0,
        tax: gst,
        total: base + gst
      };
    });

    const payload = {
      order: selectedOrderId || null,
      order_reference: orderReference || null,
      transaction_id: transactionId || null,
      currency,
      currency_symbol: currencySymbol,
      payment_status: paymentStatus,
      payment_method: paymentMethod,
      invoice_date: new Date(invoiceDate).toISOString(),
      due_date: new Date(dueDate).toISOString(),
      subtotal,
      tax: taxTotal,
      total,
      amount_paid: paymentStatus === 'PAID' ? total : 0,
      balance_due: paymentStatus === 'PAID' ? 0 : total,
      seller_details: {
        company_name: companyName,
        business_name: companyName,
        company_logo_url: companyLogoUrl,
        logo_url: companyLogoUrl,
        phone: companyPhone,
        email: companyEmail,
        address: companyAddress,
        tax_id_gstin: companyGstin
      },
      billing_details: { 
        name: customerName, 
        email: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        tax_id_gstin: customerGstin
      },
      line_items: formattedItems
    };

    try {
      await axios.post(`${API_BASE_URL}/api/invoices/`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showToast('Invoice generated & saved successfully!');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error('Invoice creation error:', err.response?.data || err);
      const errMsg = err.response?.data?.detail || 
                     (typeof err.response?.data === 'object' ? JSON.stringify(err.response.data) : null) || 
                     'Failed to create invoice';
      showToast(errMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">Create GST Invoice</h3>
              <p className="text-xs text-slate-500 font-medium">Link customer orders, select products, and manage company logo branding</p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form className="p-6 overflow-y-auto flex-1 space-y-6 text-xs" onSubmit={handleSubmit}>
          
          {/* SECTION 1: COMPANY BRANDING & LOGO */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-slate-600">
                <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                1. Company Branding & Logo Settings
              </h4>
              <span className="text-[10px] text-slate-400 font-medium">Saved to workspace profile</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
              {/* Logo Preview & Uploader (4 Cols) */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-3 bg-white border border-dashed border-slate-300 rounded-xl space-y-2 text-center">
                {companyLogoUrl ? (
                  <div className="relative group">
                    <img 
                      src={companyLogoUrl} 
                      alt="Company Logo" 
                      className="h-14 max-w-[160px] object-contain rounded-md" 
                    />
                    <button
                      type="button"
                      onClick={() => setCompanyLogoUrl('')}
                      className="mt-1 text-[10px] text-rose-600 font-bold hover:underline cursor-pointer block"
                    >
                      Remove Logo
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Building2 className="w-8 h-8 mx-auto text-slate-300" />
                    <p className="text-[10px] font-bold text-slate-600">No Logo Uploaded</p>
                  </div>
                )}

                <label className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-lg cursor-pointer transition inline-flex items-center gap-1.5 shadow-2xs">
                  <Upload className="w-3 h-3" />
                  {companyLogoUrl ? 'Replace Logo' : 'Upload Logo'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                </label>
              </div>

              {/* Company Inputs (8 Cols) */}
              <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Name *</label>
                  <input
                    type="text"
                    placeholder="Your Company Business Name"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company GSTIN / Tax ID</label>
                  <input
                    type="text"
                    placeholder="27AAAAA0000A1Z5"
                    value={companyGstin}
                    onChange={e => setCompanyGstin(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono uppercase"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Email</label>
                  <input
                    type="email"
                    placeholder="billing@yourcompany.com"
                    value={companyEmail}
                    onChange={e => setCompanyEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Company Phone</label>
                  <input
                    type="text"
                    placeholder="+91 9876543210"
                    value={companyPhone}
                    onChange={e => setCompanyPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 block mb-1">Company Address</label>
                  <input
                    type="text"
                    placeholder="Building, Street, City, State, Country"
                    value={companyAddress}
                    onChange={e => setCompanyAddress(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: INVOICE FOR & PRODUCT / ORDER LINKING */}
          <div className="bg-emerald-50/40 p-4 rounded-xl border border-emerald-200/80 space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-emerald-800">
                <ShoppingCart className="w-3.5 h-3.5 text-emerald-600" />
                2. Link Invoice to Product or Existing Purchase
              </h4>

              {/* Mode Toggle Switch */}
              <div className="flex items-center bg-white p-1 rounded-xl border border-emerald-200">
                <button
                  type="button"
                  onClick={() => setInvoiceMode('ORDER')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    invoiceMode === 'ORDER' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Existing Purchase / Order
                </button>
                <button
                  type="button"
                  onClick={() => setInvoiceMode('MANUAL')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    invoiceMode === 'MANUAL' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Manual Customer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Product Autocomplete Dropdown */}
              <div>
                <label className="font-bold text-slate-700 block mb-1">Select Product Catalog Item</label>
                <select
                  value={selectedProductId}
                  onChange={e => handleSelectProduct(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                >
                  <option value="">-- Choose Product (Auto-populates price & GST) --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name || p.title} — {currencyMap[p.currency] || '₹'}{p.price || p.unit_price || 0}
                    </option>
                  ))}
                </select>
              </div>

              {/* Order / Purchase Selector */}
              {invoiceMode === 'ORDER' && (
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Select Connected Order / Purchase</label>
                  <select
                    value={selectedOrderId}
                    onChange={e => handleSelectOrder(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  >
                    <option value="">-- Select Order / Customer Purchase --</option>
                    {filteredOrders.map(o => (
                      <option key={o.id} value={o.id}>
                        #{o.order_number || o.id} — {o.customer_name || o.contact_name || 'Customer'} — {currencyMap[o.currency] || '$'}{o.total_amount || o.amount || 0} ({o.payment_status || 'Paid'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: CUSTOMER & BILLING DETAILS */}
          <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200/80 space-y-3">
            <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5 text-slate-500">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              3. Customer Details & Billing Address
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer / Buyer Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma / Acme Inc"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer Email *</label>
                <input
                  type="email"
                  placeholder="customer@example.com"
                  value={customerEmail}
                  onChange={e => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={customerPhone}
                  onChange={e => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Customer GSTIN / Tax ID</label>
                <input
                  type="text"
                  placeholder="27AAAAA0000A1Z5"
                  value={customerGstin}
                  onChange={e => setCustomerGstin(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-mono uppercase"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Billing Address</label>
              <textarea
                rows={2}
                placeholder="Street address, City, State, Pincode"
                value={customerAddress}
                onChange={e => setCustomerAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 font-medium"
              />
            </div>
          </div>

          {/* SECTION 4: INVOICE META & PAYMENT CONFIG */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 bg-white p-3 rounded-xl border border-slate-200">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Invoice Date</label>
              <input
                type="date"
                value={invoiceDate}
                onChange={e => setInvoiceDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Transaction Currency</label>
              <select
                value={currency}
                onChange={e => handleCurrencyChange(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-800"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="AED">AED (AED)</option>
                <option value="SAR">SAR (SAR)</option>
                <option value="AUD">AUD (A$)</option>
                <option value="CAD">CAD (C$)</option>
                <option value="SGD">SGD (S$)</option>
                <option value="JPY">JPY (¥)</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Status</label>
              <select
                value={paymentStatus}
                onChange={e => setPaymentStatus(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-bold text-slate-800"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">UNPAID / PENDING</option>
                <option value="PARTIALLY PAID">PARTIALLY PAID</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Payment Method</label>
              <input
                type="text"
                placeholder="Razorpay / Cashfree / Card"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 font-medium text-slate-700"
              />
            </div>
          </div>

          {/* SECTION 5: LINE ITEMS TABLE */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px] text-slate-500">
                Products / Line Items Pricing
              </h4>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-2.5 py-1 rounded-lg text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Item Row
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-extrabold uppercase text-[10px] border-b border-slate-200">
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-2 w-28">SKU</th>
                    <th className="py-2.5 px-2 text-center w-20">Qty</th>
                    <th className="py-2.5 px-3 text-right w-32">Unit Price ({currencySymbol})</th>
                    <th className="py-2.5 px-3 text-right w-28">GST Rate (%)</th>
                    <th className="py-2.5 px-3 text-right w-32">Line Total</th>
                    <th className="py-2.5 px-2 text-center w-10"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {items.map((item, idx) => {
                    const base = (Number(item.quantity) || 0) * (Number(item.unit_price) || 0);
                    const gst = base * ((Number(item.tax_rate) || 0) / 100);
                    const lineTotal = base + gst;

                    return (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="Product or service name..."
                            value={item.name}
                            onChange={e => handleItemChange(idx, 'name', e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 focus:outline-hidden focus:border-emerald-500"
                            required
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="text"
                            placeholder="SKU"
                            value={item.sku || ''}
                            onChange={e => handleItemChange(idx, 'sku', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 font-mono text-[11px]"
                          />
                        </td>

                        <td className="p-2">
                          <input
                            type="number"
                            min="1"
                            placeholder="1"
                            value={item.quantity}
                            onChange={e => handleItemChange(idx, 'quantity', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-center font-bold"
                          />
                        </td>

                        <td className="p-2">
                          <div className="relative">
                            <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">{currencySymbol}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={item.unit_price}
                              onChange={e => handleItemChange(idx, 'unit_price', e.target.value)}
                              className="w-full pl-6 pr-2 py-1.5 rounded-lg border border-slate-200 text-right font-bold"
                            />
                          </div>
                        </td>

                        <td className="p-2">
                          <select
                            value={item.tax_rate}
                            onChange={e => handleItemChange(idx, 'tax_rate', e.target.value)}
                            className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-right font-bold text-slate-700"
                          >
                            <option value="0">0% (Exempt)</option>
                            <option value="5">5% GST</option>
                            <option value="12">12% GST</option>
                            <option value="18">18% GST</option>
                            <option value="28">28% GST</option>
                          </select>
                        </td>

                        <td className="p-2 text-right font-extrabold text-slate-900">
                          {currencySymbol}{lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>

                        <td className="p-2 text-center">
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(idx)}
                            disabled={items.length === 1}
                            className="p-1 text-slate-400 hover:text-rose-600 disabled:opacity-30 cursor-pointer"
                            title="Remove row"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Financial Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-72 bg-gradient-to-br from-slate-50 to-emerald-50/30 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600 font-medium">
                <span>Subtotal (Excl. Tax):</span>
                <span>{currencySymbol}{subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="flex justify-between text-slate-600 font-medium">
                <span>Total GST / Tax:</span>
                <span>{currencySymbol}{taxTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                <span>Grand Total:</span>
                <span className="text-emerald-700">{currencySymbol}{total.toLocaleString(undefined, { minimumFractionDigits: 2 })} {currency}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Generating Invoice...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate & Save Invoice
                </>
              )}
            </button>
          </div>

        </form>

        {/* Toast Notification */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-4 py-3 rounded-xl shadow-xl border text-xs font-extrabold flex items-center gap-2 ${
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            <Sparkles className="w-4 h-4" />
            <span>{toast.msg}</span>
          </div>
        )}

      </div>
    </div>
  );
}

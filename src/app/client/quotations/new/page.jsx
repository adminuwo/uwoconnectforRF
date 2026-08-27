'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Save, ArrowLeft, Search, UserPlus, ShoppingBag, 
  HelpCircle, Calendar, DollarSign, Loader2, Sparkles, RefreshCw, FileText, ChevronRight, Eye, Maximize2
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';
import SalesDocumentPreviewModal from '@/components/sales/SalesDocumentPreviewModal';

const NewQuotationPage = () => {
  const router = useRouter();
  
  // General Info
  const [editId, setEditId] = useState(null);
  const [docType, setDocType] = useState('QUOTATION');
  const [docDate, setDocDate] = useState(new Date().toISOString().split('T')[0]);
  const [validUntil, setValidUntil] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 15);
    return d.toISOString().split('T')[0];
  });
  const [refNum, setRefNum] = useState('');
  const [salespersonId, setSalespersonId] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [currencySymbol, setCurrencySymbol] = useState('$');
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Company Branding Details
  const [companyName, setCompanyName] = useState('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [taxIdGstin, setTaxIdGstin] = useState('');
  const [website, setWebsite] = useState('');

  // Customer Select & Custom Input
  const [contacts, setContacts] = useState([]);
  const [contactSearch, setContactSearch] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactDropdown, setShowContactDropdown] = useState(false);
  const [showNewContactFields, setShowNewContactFields] = useState(false);

  // Customer Form Fields
  const [customerName, setCustomerName] = useState('');
  const [customerCompany, setCustomerCompany] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [taxNumber, setTaxNumber] = useState('');

  // Products Catalog auto-complete
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [showProductDropdown, setShowProductDropdown] = useState(null); // row index

  // Line Items
  const [items, setItems] = useState([
    { name: '', description: '', sku: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_type: 'PERCENTAGE', discount_value: 0, tax_rate: 18, line_total: 0 }
  ]);

  // Notes
  const [customerNotes, setCustomerNotes] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [termsConditions, setTermsConditions] = useState('1. Payment is due within 15 days of document date.\n2. Goods once sold will not be taken back.');

  // Proposal specific Cover & Sections
  const [proposalSections, setProposalSections] = useState([
    { title: 'Project Overview', content: 'Describe the main project context and alignment.' },
    { title: 'Scope of Work', content: 'Outline details of work deliverables and timeline.' }
  ]);

  // UI States
  const [loading, setLoading] = useState(false);
  const [salespeople, setSalespeople] = useState([]);

  // Comprehensive Global Currencies list
  const currencies = [
    { code: 'USD', symbol: '$' },
    { code: 'INR', symbol: '₹' },
    { code: 'EUR', symbol: '€' },
    { code: 'GBP', symbol: '£' },
    { code: 'AED', symbol: 'AED' },
    { code: 'SAR', symbol: 'SAR' },
    { code: 'AUD', symbol: 'A$' },
    { code: 'CAD', symbol: 'C$' },
    { code: 'SGD', symbol: 'S$' },
    { code: 'JPY', symbol: '¥' },
    { code: 'QAR', symbol: 'QAR' },
    { code: 'MYR', symbol: 'RM' },
    { code: 'IDR', symbol: 'Rp' },
    { code: 'BRL', symbol: 'R$' },
    { code: 'ZAR', symbol: 'R' },
  ];

  const fetchClientProfile = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${API_BASE_URL}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const clientData = res.data.client || {};
      setCompanyName(clientData.business_name || '');
      setCompanyLogoUrl(clientData.company_logo_url || '');
      setCompanyPhone(clientData.phone_number || '');
      setCompanyAddress(clientData.address || '');
      setTaxIdGstin(clientData.tax_id_gstin || '');
      setWebsite(clientData.website || '');
      if (clientData.currency || clientData.settings?.currency) {
        setCurrency(clientData.currency || clientData.settings.currency);
      }
      if (res.data.user?.email) setCompanyEmail(res.data.user.email);
    } catch (err) {
      console.error("Failed to fetch client profile for company branding", err);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchProducts();
    fetchSalespeople();
    fetchClientProfile();
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const type = params.get('type');
      if (type === 'PROPOSAL' || type === 'QUOTATION') {
        setDocType(type);
      }
      const edit_id = params.get('edit_id') || params.get('id');
      if (edit_id) {
        setEditId(edit_id);
        fetchDocumentForEdit(edit_id);
      }
    }
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest('.contact-search-container')) {
        setShowContactDropdown(false);
      }
      if (!e.target.closest('.product-search-container')) {
        setShowProductDropdown(null);
      }
    };
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const fetchDocumentForEdit = async (docId) => {
    const token = localStorage.getItem('uwo_token');
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/sales-documents/${docId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data;
      if (data) {
        if (data.document_type) setDocType(data.document_type);
        if (data.document_date) setDocDate(data.document_date);
        if (data.valid_until) setValidUntil(data.valid_until);
        if (data.reference_number) setRefNum(data.reference_number);
        if (data.salesperson) setSalespersonId(data.salesperson);
        if (data.currency) setCurrency(data.currency);
        if (data.currency_symbol) setCurrencySymbol(data.currency_symbol);

        if (data.customer_name) setCustomerName(data.customer_name);
        if (data.customer_company) setCustomerCompany(data.customer_company);
        if (data.customer_email) setCustomerEmail(data.customer_email);
        if (data.customer_phone) setCustomerPhone(data.customer_phone);

        // Load document company_details snapshot if available
        if (data.company_details || data.client_details) {
          const comp = data.company_details || data.client_details || {};
          if (comp.business_name) setCompanyName(comp.business_name);
          if (comp.company_logo_url) setCompanyLogoUrl(comp.company_logo_url);
          if (comp.email) setCompanyEmail(comp.email);
          if (comp.phone_number) setCompanyPhone(comp.phone_number);
          if (comp.address) setCompanyAddress(comp.address);
          if (comp.tax_id_gstin) setTaxIdGstin(comp.tax_id_gstin);
          if (comp.website) setWebsite(comp.website);
        }
        if (data.billing_address) setBillingAddress(data.billing_address);
        if (data.shipping_address) setShippingAddress(data.shipping_address);
        if (data.tax_number) setTaxNumber(data.tax_number);

        if (data.customer_notes) setCustomerNotes(data.customer_notes);
        if (data.internal_notes) setInternalNotes(data.internal_notes);
        if (data.terms_conditions) setTermsConditions(data.terms_conditions);

        if (Array.isArray(data.items) && data.items.length > 0) {
          setItems(data.items);
        }
        if (Array.isArray(data.proposal_sections) && data.proposal_sections.length > 0) {
          setProposalSections(data.proposal_sections);
        }
      }
    } catch (err) {
      console.error("Error loading document for editing:", err);
      alert("Could not load document details for editing.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Sync symbol
    const cur = currencies.find(c => c.code === currency);
    if (cur) setCurrencySymbol(cur.symbol);
  }, [currency]);

  // Recalculates items math on every change
  useEffect(() => {
    const updated = items.map(item => {
      const base = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
      let disc = 0;
      if (item.discount_type === 'PERCENTAGE') {
        disc = base * (parseFloat(item.discount_value || 0) / 100);
      } else {
        disc = parseFloat(item.discount_value || 0);
      }
      const taxable = base - disc;
      const tax = taxable * (parseFloat(item.tax_rate || 0) / 100);
      const total = taxable + tax;
      return { ...item, line_total: Math.max(0, total) };
    });
    
    // Compare to avoid infinite loop
    if (JSON.stringify(updated) !== JSON.stringify(items)) {
      setItems(updated);
    }
  }, [items]);

  const fetchContacts = async () => {
    const token = localStorage.getItem('uwo_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      const res = await axios.get(`${API_URL}/api/contacts/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.warn("Could not load contacts list", err);
    }
  };

  const fetchProducts = async () => {
    const token = localStorage.getItem('uwo_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      // First try to fetch from catalog products
      const res = await axios.get(`${API_URL}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = Array.isArray(res.data) ? res.data : res.data.results || [];
      if (data.length > 0) {
        setProducts(data);
        return;
      }
      
      // Fallback to team projects if catalog is empty
      const projRes = await axios.get(`${API_URL}/api/team/projects/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const projData = Array.isArray(projRes.data) ? projRes.data : projRes.data.results || [];
      if (projData.length > 0) {
        setProducts(projData);
        return;
      }
    } catch (err) {
      console.warn("Could not load products catalog from API, trying fallback", err);
    }

    // Default fallback to mock products if everything else is empty or fails
    setProducts([
      { id: 1, name: 'Premium Enterprise Package', sku: 'EP-100', price: 2500, description: 'Complete enterprise support and API access' },
      { id: 2, name: 'Custom AI Bot Implementation', sku: 'AI-200', price: 1800, description: 'Custom machine learning automation setup' },
      { id: 3, name: 'Standard Subscription Service', sku: 'SS-50', price: 150, description: 'Monthly platform license subscription' }
    ]);
  };

  const fetchSalespeople = async () => {
    const token = localStorage.getItem('uwo_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      const res = await axios.get(`${API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSalespeople(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.warn("Could not load staff", err);
    }
  };

  // Customer Select handlers
  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
    setCustomerName(contact.name);
    setCustomerCompany(contact.notes || ''); // fallback
    setCustomerEmail(contact.email);
    setCustomerPhone(contact.phone_number);
    setBillingAddress(contact.notes || '');
    setShowContactDropdown(false);
    setContactSearch(contact.name);
  };

  const handleClearContact = () => {
    setSelectedContact(null);
    setCustomerName('');
    setCustomerCompany('');
    setCustomerEmail('');
    setCustomerPhone('');
    setBillingAddress('');
    setContactSearch('');
  };

  // Line Item actions
  const handleAddItem = () => {
    setItems([
      ...items,
      { name: '', description: '', sku: '', quantity: 1, unit: 'pcs', unit_price: 0, discount_type: 'PERCENTAGE', discount_value: 0, tax_rate: 18, line_total: 0 }
    ]);
  };

  const handleRemoveItem = (index) => {
    if (items.length === 1) return;
    setItems(items.filter((_, idx) => idx !== index));
  };

  const handleItemChange = (index, field, value) => {
    const copy = [...items];
    copy[index][field] = value;
    setItems(copy);
  };

  const handleSelectProduct = (index, prod) => {
    const copy = [...items];
    copy[index].name = prod.name;
    copy[index].description = prod.description || '';
    copy[index].sku = prod.sku || '';
    copy[index].unit_price = prod.price || 0;
    setItems(copy);
    setShowProductDropdown(null);
  };

  // Math aggregates calculations
  const calculateTotals = () => {
    let subtotal = 0;
    let discAmount = 0;
    let taxAmount = 0;

    items.forEach(item => {
      const base = parseFloat(item.quantity || 0) * parseFloat(item.unit_price || 0);
      let disc = 0;
      if (item.discount_type === 'PERCENTAGE') {
        disc = base * (parseFloat(item.discount_value || 0) / 100);
      } else {
        disc = parseFloat(item.discount_value || 0);
      }
      const taxable = base - disc;
      const tax = taxable * (parseFloat(item.tax_rate || 0) / 100);
      
      subtotal += base;
      discAmount += disc;
      taxAmount += tax;
    });

    const grandTotal = (subtotal - discAmount) + taxAmount;

    return {
      subtotal: subtotal.toFixed(2),
      discountAmount: discAmount.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  };

  const totals = calculateTotals();

  // Save Proposal/Quote
  const handleSaveDocument = async () => {
    if (!customerName || !customerEmail) {
      alert("Please specify a customer name and email address.");
      return;
    }
    
    // Check items name
    if (items.some(i => !i.name)) {
      alert("All line items must have a product name.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem('uwo_token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    const payload = {
      document_type: docType,
      company_details: {
        business_name: companyName,
        company_logo_url: companyLogoUrl,
        email: companyEmail,
        phone_number: companyPhone,
        address: companyAddress,
        tax_id_gstin: taxIdGstin,
        website: website
      },
      customer: selectedContact?.id || null,
      customer_name: customerName,
      customer_company: customerCompany,
      customer_email: customerEmail,
      customer_phone: customerPhone,
      billing_address: billingAddress,
      shipping_address: shippingAddress,
      tax_number: taxNumber,
      document_date: docDate,
      valid_until: validUntil,
      reference_number: refNum,
      salesperson: salespersonId || null,
      currency: currency,
      currency_symbol: currencySymbol,
      customer_notes: customerNotes,
      internal_notes: internalNotes,
      terms_conditions: termsConditions,
      items: items,
      proposal_sections: docType === 'PROPOSAL' ? proposalSections : []
    };

    try {
      if (editId) {
        await axios.patch(`${API_BASE_URL}/api/sales-documents/${editId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`${docType === 'QUOTATION' ? 'Quotation' : 'Proposal'} updated successfully!`);
      } else {
        await axios.post(`${API_BASE_URL}/api/sales-documents/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert(`${docType === 'QUOTATION' ? 'Quotation' : 'Proposal'} created successfully!`);
      }
      router.push(docType === 'PROPOSAL' ? '/client/proposals' : '/client/quotations');
    } catch (err) {
      alert("Failed to save document: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Proposal block additions
  const handleAddProposalSection = () => {
    setProposalSections([
      ...proposalSections,
      { title: 'New Scope Block', content: 'Provide scope parameters here.' }
    ]);
  };

  const handleRemoveProposalSection = (index) => {
    setProposalSections(proposalSections.filter((_, idx) => idx !== index));
  };

  const handleProposalSectionChange = (index, field, value) => {
    const copy = [...proposalSections];
    copy[index][field] = value;
    setProposalSections(copy);
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20 space-y-6">
        
        {/* Back and Page title bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 border border-slate-200 bg-white cursor-pointer"
            >
              <ArrowLeft size={14} />
            </button>
            <div>
              <h1 className="text-lg font-black text-slate-900 tracking-tight">
                {editId ? `Edit ${docType === 'QUOTATION' ? 'Quotation' : 'Proposal'}` : `Create ${docType === 'QUOTATION' ? 'Quotation' : 'Proposal'}`}
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {editId ? 'Modify document details and items' : 'Configure new Proposal or Quotation'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowPreviewModal(true)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 text-indigo-700 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
          >
            <Eye size={14} />
            <span>Executive Preview</span>
          </button>
        </div>

        {/* Builder Layout - Split Grid Screen */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SECTION: Builder Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-6">
            
            {/* Header switches */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Document Type</label>
                <div className="flex items-center bg-slate-50 p-1 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setDocType('QUOTATION')}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all cursor-pointer",
                      docType === 'QUOTATION' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Quotation
                  </button>
                  <button
                    type="button"
                    onClick={() => setDocType('PROPOSAL')}
                    className={cn(
                      "flex-1 py-1.5 rounded-lg text-xs font-bold text-center transition-all cursor-pointer",
                      docType === 'PROPOSAL' ? "bg-white text-emerald-700 shadow-sm" : "text-slate-500 hover:text-slate-900"
                    )}
                  >
                    Proposal
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full p-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                >
                  {currencies.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Company Branding Section */}
            <div className="space-y-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Company Branding</h3>
                <span className="text-[10px] text-slate-400 font-semibold">Loaded from saved settings</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden p-1 shrink-0">
                  {companyLogoUrl ? (
                    <img src={companyLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[9px] font-bold text-slate-400 uppercase">No Logo</span>
                  )}
                </div>

                <div className="flex-1 space-y-1 text-center sm:text-left">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Logo Image</label>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <label className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-lg cursor-pointer transition">
                      Upload Logo
                      <input 
                        type="file" 
                        accept="image/png, image/jpeg, image/jpg, image/webp" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (file.size > 3 * 1024 * 1024) {
                            alert("Logo image size must be under 3MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onload = (ev) => setCompanyLogoUrl(ev.target.result);
                          reader.readAsDataURL(file);
                        }} 
                        className="hidden" 
                      />
                    </label>
                    {companyLogoUrl && (
                      <button
                        type="button"
                        onClick={() => setCompanyLogoUrl('')}
                        className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-lg cursor-pointer transition"
                      >
                        Remove Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your Business Name"
                    className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Email</label>
                  <input
                    type="email"
                    value={companyEmail}
                    onChange={(e) => setCompanyEmail(e.target.value)}
                    placeholder="billing@company.com"
                    className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Phone</label>
                  <input
                    type="text"
                    value={companyPhone}
                    onChange={(e) => setCompanyPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">GSTIN / Tax ID</label>
                  <input
                    type="text"
                    value={taxIdGstin}
                    onChange={(e) => setTaxIdGstin(e.target.value)}
                    placeholder="07AAAAA0000A1Z5"
                    className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company Address</label>
                  <input
                    type="text"
                    value={companyAddress}
                    onChange={(e) => setCompanyAddress(e.target.value)}
                    placeholder="Company HQ Address"
                    className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            {/* Customer Details Form block */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Customer Information</h3>
                
                {/* Clear Selected Customer */}
                {selectedContact && (
                  <button
                    type="button"
                    onClick={handleClearContact}
                    className="text-[10px] font-bold text-red-650 text-red-650 hover:underline cursor-pointer"
                  >
                    Clear Selection
                  </button>
                )}
              </div>

              {/* Dynamic Auto-suggest customer search bar */}
              <div className="relative contact-search-container">
                <Search size={14} className="absolute left-3 top-3.5 text-slate-450 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search existing contact by name..."
                  value={contactSearch || ''}
                  onChange={(e) => {
                    setContactSearch(e.target.value);
                    setShowContactDropdown(true);
                  }}
                  onFocus={() => setShowContactDropdown(true)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500"
                />
                
                {showContactDropdown && (
                  <div className="absolute top-11 left-0 right-0 z-30 max-h-48 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100">
                    {contacts.filter(c => !contactSearch || c.name.toLowerCase().includes(contactSearch.toLowerCase())).map(contact => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => handleSelectContact(contact)}
                        className="w-full text-left p-2.5 hover:bg-slate-50 text-xs font-medium text-slate-800 block"
                      >
                        <span className="font-bold">{contact.name}</span> • <span className="text-slate-400">{contact.email}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewContactFields(true);
                        setShowContactDropdown(false);
                      }}
                      className="w-full text-left p-2.5 hover:bg-emerald-50 text-xs font-bold text-emerald-650 flex items-center gap-1.5"
                    >
                      <UserPlus size={13} />
                      <span>Create New Customer Details Manually</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Manual Customer Details Input Panel */}
              {(showNewContactFields || selectedContact) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-slate-50/50 border border-slate-100 rounded-2xl animate-fadeIn">
                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Name *</label>
                    <input
                      type="text"
                      required
                      value={customerName || ''}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Company</label>
                    <input
                      type="text"
                      value={customerCompany || ''}
                      onChange={(e) => setCustomerCompany(e.target.value)}
                      placeholder="Enterprise Co."
                      className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Email *</label>
                    <input
                      type="email"
                      required
                      value={customerEmail || ''}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="jane@company.com"
                      className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Phone</label>
                    <input
                      type="text"
                      value={customerPhone || ''}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+1 555-0199"
                      className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Billing Address</label>
                    <textarea
                      rows={2}
                      value={billingAddress || ''}
                      onChange={(e) => setBillingAddress(e.target.value)}
                      placeholder="Street, City, State, ZIP"
                      className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Document Dates & Staff selector */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Dates & Sales Staff</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Document Date</label>
                  <input
                    type="date"
                    value={docDate}
                    onChange={(e) => setDocDate(e.target.value)}
                    className="w-full p-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full p-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Sales Staff Assigned</label>
                  <select
                    value={salespersonId}
                    onChange={(e) => setSalespersonId(e.target.value)}
                    className="w-full p-2 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  >
                    <option value="">Choose Staff Member</option>
                    {salespeople.map(p => (
                      <option key={p.id} value={p.id}>{p.username}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Line items dynamic pricing builder table */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Products & Services Pricing</h3>
              <div className="space-y-3">
                {items.map((item, idx) => (
                  <div key={idx} className="p-4 border border-slate-100 bg-slate-50/20 rounded-2xl space-y-3 relative">
                    
                    {/* Item header name with autocomplete catalog suggest */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-6 relative product-search-container">
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Product Details *</label>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            handleItemChange(idx, 'name', e.target.value);
                            setShowProductDropdown(idx);
                          }}
                          onFocus={() => setShowProductDropdown(idx)}
                          placeholder="Type product name or select from catalog..."
                          className="w-full p-2 bg-white text-slate-850 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                        
                        {/* Auto-suggest dropdown catalog */}
                        {showProductDropdown === idx && (
                          <div className="absolute top-12 left-0 right-0 z-30 max-h-40 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg divide-y divide-slate-100">
                            {products.filter(p => !item.name || p.name.toLowerCase().includes(item.name.toLowerCase())).map(p => (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleSelectProduct(idx, p)}
                                className="w-full text-left p-2 hover:bg-slate-50 text-xs font-medium text-slate-800 block"
                              >
                                <span className="font-bold">{p.name}</span> • <span className="text-emerald-700">${p.price}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">SKU</label>
                        <input
                          type="text"
                          value={item.sku || ''}
                          onChange={(e) => handleItemChange(idx, 'sku', e.target.value)}
                          placeholder="SKU Code"
                          className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Unit</label>
                        <input
                          type="text"
                          value={item.unit || ''}
                          onChange={(e) => handleItemChange(idx, 'unit', e.target.value)}
                          placeholder="pcs, hours, etc."
                          className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                        />
                      </div>
                    </div>

                    {/* Quantity, price, tax, discount inputs */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity ?? ''}
                          onChange={(e) => handleItemChange(idx, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 bg-white text-slate-850 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Unit Price ({currencySymbol})</label>
                        <input
                          type="number"
                          value={item.unit_price ?? ''}
                          onChange={(e) => handleItemChange(idx, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 bg-white text-slate-850 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-semibold"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Tax Rate (%)</label>
                        <input
                          type="number"
                          value={item.tax_rate ?? ''}
                          onChange={(e) => handleItemChange(idx, 'tax_rate', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 bg-white text-slate-800 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <div className="relative">
                        <label className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Discount Value</label>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={item.discount_value ?? ''}
                            onChange={(e) => handleItemChange(idx, 'discount_value', parseFloat(e.target.value) || 0)}
                            className="w-full p-2 bg-white text-slate-800 text-xs rounded-l-lg border border-r-0 border-slate-200 focus:outline-none focus:border-emerald-500"
                          />
                          <select
                            value={item.discount_type || 'PERCENTAGE'}
                            onChange={(e) => handleItemChange(idx, 'discount_type', e.target.value)}
                            className="p-2 bg-slate-100 text-slate-700 text-xs rounded-r-lg border border-slate-200 focus:outline-none"
                          >
                            <option value="PERCENTAGE">%</option>
                            <option value="FIXED">{currencySymbol}</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Actions and final line totals details */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        Line Total: <span className="text-slate-900 font-black">{currencySymbol}{parseFloat(item.line_total).toFixed(2)}</span>
                      </span>
                      
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="text-slate-450 hover:text-red-500 text-slate-400 p-1 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-250 border-slate-200 text-slate-650 hover:text-slate-900 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus size={13} />
                  <span>Add Line Item Pricing</span>
                </button>
              </div>
            </div>

            {/* Proposal Block builder (shown only for DocType PROPOSAL) */}
            {docType === 'PROPOSAL' && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-widest">Proposal Content Sections</h3>
                <div className="space-y-4">
                  {proposalSections.map((sec, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 bg-slate-50/20 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleProposalSectionChange(idx, 'title', e.target.value)}
                          placeholder="Section Title (e.g. Scope of Work)"
                          className="font-bold text-xs text-slate-850 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveProposalSection(idx)}
                          className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleProposalSectionChange(idx, 'content', e.target.value)}
                        placeholder="Provide details..."
                        className="w-full p-2 bg-white text-slate-700 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={handleAddProposalSection}
                    className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-200 text-slate-650 hover:text-slate-905 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Custom Section Block</span>
                  </button>
                </div>
              </div>
            )}

            {/* Notes & Terms Conditions block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Customer Notes (Shown on PDF)</label>
                <textarea
                  rows={3}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  placeholder="Thank you for your business!"
                  className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Terms & Conditions</label>
                <textarea
                  rows={3}
                  value={termsConditions}
                  onChange={(e) => setTermsConditions(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Save Buttons Bar */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowPreviewModal(true)}
                className="py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-extrabold rounded-xl border border-indigo-200/60 cursor-pointer flex items-center gap-1.5"
              >
                <Eye size={13} />
                <span>Preview Document</span>
              </button>
              <button
                type="button"
                onClick={handleSaveDocument}
                disabled={loading}
                className="py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-emerald-600/10 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                <span>Save Document</span>
              </button>
            </div>

          </div>

          {/* RIGHT SECTION: Premium Live Preview Sheet (5 Cols) */}
          <div className="lg:col-span-5 bg-slate-100 border border-slate-200 rounded-3xl p-5 shadow-inner sticky top-20 select-none">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-1.5">
                <Sparkles size={14} className="text-emerald-600" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Live Dynamic Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="px-2 py-1 rounded-md bg-white border border-slate-200 text-[9px] font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1 cursor-pointer shadow-2xs"
                  title="Expand Full Screen Preview"
                >
                  <Maximize2 size={10} />
                  <span>Expand Preview</span>
                </button>
                <span className="text-[8px] bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">A4 SHEET</span>
              </div>
            </div>

            {/* Preview Sheet Simulation Card */}
            <div className="mt-4 bg-white rounded-2xl shadow-xl p-5 aspect-[1/1.414] overflow-y-auto space-y-5 border border-slate-150 border-slate-200 relative text-[9px] leading-normal font-medium text-slate-700">
              
              {/* Cover page simulation (only for PROPOSALS) */}
              {docType === 'PROPOSAL' && (
                <div className="space-y-12 py-10 border-b border-dashed border-slate-200">
                  <div className="text-center space-y-4">
                    <span className="text-[7px] text-emerald-600 font-extrabold uppercase tracking-widest">PROPOSAL DOC</span>
                    <h2 className="text-lg font-black text-slate-900 tracking-tight leading-none mt-1">
                      {customerName || 'Customer Client proposal title'}
                    </h2>
                    <p className="text-[8px] text-slate-400 font-semibold uppercase tracking-wider">
                      Prepared Date: {docDate}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6 text-[8px]">
                    <div>
                      <span className="block font-bold text-slate-800">Prepared For:</span>
                      <span className="block text-slate-500">{customerCompany || customerName || 'Client Org'}</span>
                    </div>
                    <div>
                      <span className="block font-bold text-slate-800">Prepared By:</span>
                      <span className="block text-slate-500">UWO Connect Staff</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Business Header block */}
              {docType === 'QUOTATION' && (
                <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 tracking-tight">Your Business Name</h2>
                    <p className="text-[7px] text-slate-400">123 Corporate Park, Bangalore, India</p>
                  </div>
                  <div className="text-right">
                    <h2 className="text-xs font-black text-emerald-600 tracking-wider">QUOTATION</h2>
                    <p className="text-[7px] text-slate-400 font-bold"># UWO-QTN-YYYY-XXXXX</p>
                  </div>
                </div>
              )}

              {/* Customer and Dates meta */}
              <div className="grid grid-cols-2 gap-3 text-[8px]">
                <div className="space-y-0.5">
                  <span className="block font-black text-slate-450 uppercase tracking-widest text-[7px] text-slate-400">Customer</span>
                  <span className="block font-black text-slate-800">{customerName || 'John Doe'}</span>
                  <span className="block text-slate-500">{customerCompany || 'Client Org'}</span>
                  <span className="block text-slate-500">{customerEmail || 'client@org.com'}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-black text-slate-450 uppercase tracking-widest text-[7px] text-slate-400">Document Info</span>
                  <span className="block text-slate-500">Date: {docDate}</span>
                  <span className="block text-slate-500">Valid Until: {validUntil}</span>
                  <span className="block text-slate-550 text-slate-500">Terms: 15 Days</span>
                </div>
              </div>

              {/* Proposal Content preview */}
              {docType === 'PROPOSAL' && proposalSections.length > 0 && (
                <div className="space-y-3.5 border-t border-slate-100 pt-3">
                  {proposalSections.map((sec, idx) => (
                    <div key={idx} className="space-y-1">
                      <h4 className="font-bold text-slate-900 text-[8px]">{sec.title || 'Section block'}</h4>
                      <p className="text-slate-500 text-[8px] leading-relaxed">{sec.content || 'Content detail'}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Line items table preview */}
              <div className="space-y-2 border-t border-slate-100 pt-3">
                <div className="grid grid-cols-12 gap-1 text-[7px] font-extrabold text-slate-400 uppercase tracking-wider pb-1 border-b border-slate-100">
                  <span className="col-span-6">Description</span>
                  <span className="col-span-2 text-right">Qty</span>
                  <span className="col-span-2 text-right">Price</span>
                  <span className="col-span-2 text-right">Total</span>
                </div>
                <div className="space-y-1.5">
                  {items.map((it, idx) => (
                    <div key={idx} className="grid grid-cols-12 gap-1 text-[8px] items-start border-b border-slate-50 pb-1.5">
                      <div className="col-span-6">
                        <span className="block font-black text-slate-800">{it.name || 'Product Details'}</span>
                        <span className="block text-[6px] text-slate-400 mt-0.5">{it.description || 'Details description'}</span>
                      </div>
                      <span className="col-span-2 text-right text-slate-500">{it.quantity} {it.unit}</span>
                      <span className="col-span-2 text-right text-slate-500">{currencySymbol}{it.unit_price}</span>
                      <span className="col-span-2 text-right font-black text-slate-900">{currencySymbol}{parseFloat(it.line_total).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Math summaries block preview */}
              <div className="flex flex-col items-end pt-3 border-t border-slate-100 space-y-1">
                <div className="flex items-center gap-4 text-[8px]">
                  <span className="text-slate-400 font-bold">Subtotal:</span>
                  <span className="font-bold text-slate-800">{currencySymbol}{totals.subtotal}</span>
                </div>
                <div className="flex items-center gap-4 text-[8px]">
                  <span className="text-slate-400 font-bold">Item Discount:</span>
                  <span className="font-bold text-slate-800">-{currencySymbol}{totals.discountAmount}</span>
                </div>
                <div className="flex items-center gap-4 text-[8px]">
                  <span className="text-slate-400 font-bold">Tax:</span>
                  <span className="font-bold text-slate-800">+{currencySymbol}{totals.taxAmount}</span>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-black text-emerald-600 pt-1 border-t border-slate-100 w-32 justify-end">
                  <span>TOTAL:</span>
                  <span>{currencySymbol}{totals.grandTotal}</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Executive Live Preview Modal */}
        {showPreviewModal && (
          <SalesDocumentPreviewModal
            doc={{
              document_type: docType,
              document_number: editId ? `EDIT-${docType.substring(0, 3)}` : `DRAFT-${docType.substring(0, 3)}`,
              document_date: docDate,
              valid_until: validUntil,
              customer_name: customerName || 'Valued Customer',
              customer_company: customerCompany,
              customer_email: customerEmail,
              customer_phone: customerPhone,
              currency: currency,
              currency_symbol: currencySymbol,
              subtotal: totals.subtotal,
              discount_amount: totals.discountAmount,
              tax_amount: totals.taxAmount,
              grand_total: totals.grandTotal,
              items: items,
              proposal_sections: proposalSections,
              customer_notes: customerNotes,
              terms_conditions: termsConditions,
              status: 'DRAFT',
              secure_token: 'preview-draft-token'
            }}
            isOpen={showPreviewModal}
            onClose={() => setShowPreviewModal(false)}
          />
        )}

      </div>
    </DashboardLayout>
  );
};

export default NewQuotationPage;

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  ShoppingBag, Plus, Loader2, Trash2, Tag, Check, DollarSign, Upload, Download,
  ExternalLink, Copy, Share2, QrCode, BarChart3, Edit3, Eye, Layers, Filter, Search,
  Sparkles, RefreshCw, X, Image as ImageIcon, Video, FileText, CheckCircle2,
  Globe, CreditCard, Calendar, Play, ArrowRight, MousePointer2, AlertCircle,
  PackageCheck, Zap, ShieldCheck, Box, ChevronRight, MessageSquare, CheckSquare, Square
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'analytics' | 'integrations'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState('basic'); // 'basic' | 'media' | 'link' | 'specs'
  const [editingId, setEditingId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  // Detail Drawer State
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [activeQrProduct, setActiveQrProduct] = useState(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedLinkType, setSelectedLinkType] = useState('ALL');
  const [selectedStockStatus, setSelectedStockStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest');

  // Bulk Operations State
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [bulkActionType, setBulkActionType] = useState('update_price'); // 'update_price' | 'update_category' | 'update_link'
  const [bulkPayload, setBulkPayload] = useState({ price: '', discount_price: '', category: 'PHYSICAL', product_url: '', cta_text: 'Buy Now', link_type: 'WEBSITE' });

  // Analytics State
  const [analyticsData, setAnalyticsData] = useState(null);

  // Form State
  const initialFormData = {
    name: '',
    price: '',
    discount_price: '',
    category: 'PHYSICAL',
    product_type: 'PHYSICAL',
    brand: '',
    sku: '',
    currency: 'USD',
    description: '',
    image_url: '',
    gallery_images: [],
    video_url: '',
    pdf_brochure_url: '',
    in_stock: true,
    stock_quantity: 100,
    availability_status: 'IN_STOCK',
    tags: [],
    product_url: '',
    link_type: 'WEBSITE',
    cta_text: 'View Product',
    button_color: '#10B981',
    button_icon: 'ExternalLink',
    open_behavior: 'NEW_TAB',
    specifications: {}
  };

  const [formData, setFormData] = useState(initialFormData);
  const [newTag, setNewTag] = useState('');
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecVal, setNewSpecVal] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [copiedCheckoutId, setCopiedCheckoutId] = useState(null);

  // Razorpay connection status (for showing checkout link buttons)
  const [razorpayConnected, setRazorpayConnected] = useState(false);

  const fetchRazorpayStatus = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/razorpay/status`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRazorpayConnected(res.data?.connected === true);
    } catch (e) {
      setRazorpayConnected(false);
    }
  };

  const getCheckoutUrl = (productId) => {
    const frontendBase = typeof window !== 'undefined' ? window.location.origin : '';
    return `${frontendBase}/checkout/${productId}`;
  };

  const handleCopyCheckoutLink = (product) => {
    const url = getCheckoutUrl(product.id);
    navigator.clipboard.writeText(url);
    setCopiedCheckoutId(product.id);
    setTimeout(() => setCopiedCheckoutId(null), 2500);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(Array.isArray(res.data) ? res.data : (res.data?.results || []));
    } catch (err) {
      console.error('Failed to fetch products', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/analytics/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Failed to fetch product analytics', err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchAnalytics();
    fetchRazorpayStatus();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData(initialFormData);
    setModalTab('basic');
    setModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      discount_price: product.discount_price || '',
      category: product.category || 'PHYSICAL',
      product_type: product.product_type || 'PHYSICAL',
      brand: product.brand || '',
      sku: product.sku || '',
      currency: product.currency || 'USD',
      description: product.description || '',
      image_url: product.image_url || '',
      gallery_images: product.gallery_images || [],
      video_url: product.video_url || '',
      pdf_brochure_url: product.pdf_brochure_url || '',
      in_stock: product.in_stock ?? true,
      stock_quantity: product.stock_quantity ?? 100,
      availability_status: product.availability_status || 'IN_STOCK',
      tags: product.tags || [],
      product_url: product.product_url || '',
      link_type: product.link_type || 'WEBSITE',
      cta_text: product.cta_text || 'View Product',
      button_color: product.button_color || '#10B981',
      button_icon: product.button_icon || 'ExternalLink',
      open_behavior: product.open_behavior || 'NEW_TAB',
      specifications: product.specifications || {}
    });
    setModalTab('basic');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Product Name and Price are required.');
      return;
    }
    try {
      setIsSaving(true);
      const token = localStorage.getItem('uwo_token');
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
        stock_quantity: parseInt(formData.stock_quantity) || 0
      };

      if (editingId) {
        await axios.patch(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${editingId}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setModalOpen(false);
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('uwo_token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleDeleteAllProducts = async () => {
    if (products.length === 0) return alert('No products to delete.');
    if (!confirm(`Are you sure you want to delete ALL ${products.length} products? This action cannot be undone.`)) return;
    try {
      const token = localStorage.getItem('uwo_token');
      const allIds = products.map(p => p.id);
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/bulk_action/`, {
        ids: allIds,
        action: 'delete'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSelectedProductIds([]);
      fetchProducts();
      fetchAnalytics();
      alert('All products deleted successfully!');
    } catch (err) {
      alert('Failed to delete all products');
    }
  };

  const handleDuplicate = async (product) => {
    try {
      const token = localStorage.getItem('uwo_token');
      const duplicateData = {
        ...product,
        name: `${product.name} (Copy)`,
        sku: product.sku ? `${product.sku}-COPY` : '',
        id: undefined
      };
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/`, duplicateData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to duplicate product');
    }
  };

  const trackProductClick = async (product, clickType = 'button') => {
    try {
      const token = localStorage.getItem('uwo_token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${product.id}/track_click/`, { type: clickType }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchAnalytics();
    } catch (e) {}
  };

  const handleCopyLink = (product) => {
    const trackingUrl = product.product_url ? `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${product.id}/redirect_link/` : window.location.href;
    navigator.clipboard.writeText(trackingUrl);
    setCopiedId(product.id);
    trackProductClick(product, 'link');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (product) => {
    const trackingUrl = `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${product.id}/redirect_link/`;
    const text = `Check out *${product.name}* ($${product.price})\n${product.description || ''}\n🔗 ${product.cta_text || 'View Product'}: ${trackingUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const body = new FormData();
    body.append('file', file);

    try {
      setImporting(true);
      const token = localStorage.getItem('uwo_token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/import_csv/`, 
        body, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert(res.data.message || 'CSV imported successfully!');
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCSVExport = () => {
    if (products.length === 0) return alert('No products to export');
    const headers = ['ID', 'Name', 'Price', 'DiscountPrice', 'Category', 'ProductType', 'Brand', 'SKU', 'ProductURL', 'LinkType', 'CTAText', 'InStock', 'Description'];
    const rows = products.map(p => [
      p.id, `"${p.name}"`, p.price, p.discount_price || '', p.category, p.product_type, `"${p.brand || ''}"`, `"${p.sku || ''}"`, `"${p.product_url || ''}"`, p.link_type, `"${p.cta_text || ''}"`, p.in_stock, `"${(p.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `uwo_catalog_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Bulk operations
  const toggleSelectProduct = (id) => {
    setSelectedProductIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const toggleSelectAll = () => {
    if (selectedProductIds.length === filteredProducts.length) {
      setSelectedProductIds([]);
    } else {
      setSelectedProductIds(filteredProducts.map(p => p.id));
    }
  };

  const handleExecuteBulkAction = async () => {
    if (selectedProductIds.length === 0) return;
    try {
      const token = localStorage.getItem('uwo_token');
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/bulk_action/`, {
        ids: selectedProductIds,
        action: bulkActionType,
        payload: bulkPayload
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message || 'Bulk operation completed');
      setSelectedProductIds([]);
      setBulkModalOpen(false);
      fetchProducts();
      fetchAnalytics();
    } catch (err) {
      alert(err.response?.data?.message || 'Bulk operation failed');
    }
  };

  // Auto-detect Link Type based on URL
  const handleProductUrlChange = (url) => {
    let detectedType = 'WEBSITE';
    let detectedCta = 'View Product';
    const lower = url.toLowerCase();

    if (lower.includes('shopify.com') || lower.includes('myshopify')) {
      detectedType = 'EXTERNAL_MARKETPLACE';
      detectedCta = 'Buy on Shopify';
    } else if (lower.includes('amazon.')) {
      detectedType = 'EXTERNAL_MARKETPLACE';
      detectedCta = 'View on Amazon';
    } else if (lower.includes('razorpay.me') || lower.includes('stripe.com') || lower.includes('checkout')) {
      detectedType = 'PAYMENT';
      detectedCta = 'Pay Now';
    } else if (lower.includes('drive.google.com') || lower.includes('dropbox.com') || lower.includes('onedrive') || lower.endsWith('.pdf')) {
      detectedType = 'DOWNLOAD';
      detectedCta = 'Download PDF';
    } else if (lower.includes('calendly.com') || lower.includes('book') || lower.includes('appointment')) {
      detectedType = 'BOOKING';
      detectedCta = 'Book Now';
    } else if (lower.includes('youtube.com') || lower.includes('vimeo.com')) {
      detectedType = 'VIDEO';
      detectedCta = 'Watch Video';
    }

    setFormData(prev => ({
      ...prev,
      product_url: url,
      link_type: prev.product_url ? prev.link_type : detectedType,
      cta_text: prev.product_url ? prev.cta_text : detectedCta
    }));
  };

  // Badge Stylings
  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'DIGITAL': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'BOOK': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'SERVICE': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'PHYSICAL': default: return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getLinkTypeIcon = (type) => {
    switch (type) {
      case 'BUY_NOW': case 'CHECKOUT': return <ShoppingBag size={12} className="text-emerald-600" />;
      case 'PAYMENT': return <CreditCard size={12} className="text-blue-600" />;
      case 'BOOKING': return <Calendar size={12} className="text-indigo-600" />;
      case 'DOWNLOAD': return <Download size={12} className="text-amber-600" />;
      case 'VIDEO': return <Play size={12} className="text-rose-600" />;
      case 'EXTERNAL_MARKETPLACE': return <ExternalLink size={12} className="text-purple-600" />;
      default: return <Globe size={12} className="text-slate-600" />;
    }
  };

  // Filtering & Sorting
  const filteredProducts = products.filter(p => {
    const matchesSearch = searchQuery === '' || 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    const matchesLink = selectedLinkType === 'ALL' || p.link_type === selectedLinkType;
    const matchesStock = selectedStockStatus === 'ALL' || 
      (selectedStockStatus === 'IN_STOCK' && p.in_stock) || 
      (selectedStockStatus === 'OUT_OF_STOCK' && !p.in_stock);

    return matchesSearch && matchesCat && matchesLink && matchesStock;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return parseFloat(a.price) - parseFloat(b.price);
    if (sortBy === 'price_desc') return parseFloat(b.price) - parseFloat(a.price);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'clicks') return ((b.link_clicks_count || 0) + (b.button_clicks_count || 0)) - ((a.link_clicks_count || 0) + (a.button_clicks_count || 0));
    return new Date(b.created_at || 0) - new Date(a.created_at || 0);
  });

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-24 font-sans text-slate-800">

        {/* --- TOP HEADER --- */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4 bg-white/70 backdrop-blur-md p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <ShoppingBag size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Product Catalog</h1>
                <p className="text-xs text-slate-500 font-medium">Enterprise WhatsApp Commerce, Product Links & AI Catalog Management</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleCSVImport} 
              accept=".csv" 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs disabled:opacity-50"
            >
              {importing ? <Loader2 size={14} className="animate-spin text-emerald-600" /> : <Upload size={14} className="text-slate-500" />}
              Import CSV
            </button>
            <button 
              onClick={handleCSVExport}
              className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs"
            >
              <Download size={14} className="text-slate-500" />
              Export CSV
            </button>
            {products.length > 0 && (
              <button 
                onClick={handleDeleteAllProducts}
                className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 rounded-2xl font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                <Trash2 size={14} className="text-rose-600" />
                Delete All
              </button>
            )}
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-[0_4px_20px_rgba(16,185,129,0.25)] transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* --- NAVIGATION TABS & METRIC STRIP --- */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
            <button 
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'catalog' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <Layers size={14} /> Catalog Items ({filteredProducts.length})
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${activeTab === 'analytics' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
            >
              <BarChart3 size={14} /> Analytics & Clicks
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-400'}`}
                title="Grid View"
              >
                <Layers size={14} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-400'}`}
                title="List View"
              >
                <FileText size={14} />
              </button>
            </div>
            {selectedProductIds.length > 0 && (
              <button 
                onClick={() => setBulkModalOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-300 rounded-xl font-bold text-xs animate-pulse cursor-pointer"
              >
                <Zap size={13} /> Bulk Actions ({selectedProductIds.length})
              </button>
            )}
          </div>
        </div>

        {/* --- MAIN CATALOG WORKSPACE TAB --- */}
        {activeTab === 'catalog' && (
          <div>
            {/* Search & Filter Toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-6">
              <div className="lg:col-span-2 relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products by name, SKU, brand..."
                  className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-xs"
                />
              </div>

              <div>
                <select 
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all shadow-xs cursor-pointer"
                >
                  <option value="ALL">All Categories</option>
                  <option value="PHYSICAL">Physical Product</option>
                  <option value="DIGITAL">Digital Product</option>
                  <option value="BOOK">Book / E-Book</option>
                  <option value="SERVICE">Service</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <select 
                  value={selectedLinkType}
                  onChange={e => setSelectedLinkType(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all shadow-xs cursor-pointer"
                >
                  <option value="ALL">All Link Types</option>
                  <option value="WEBSITE">Website</option>
                  <option value="BUY_NOW">Buy Now</option>
                  <option value="CHECKOUT">Checkout</option>
                  <option value="PAYMENT">Payment</option>
                  <option value="BOOKING">Booking</option>
                  <option value="DOWNLOAD">Download PDF</option>
                  <option value="VIDEO">Video</option>
                  <option value="EXTERNAL_MARKETPLACE">Shopify / Amazon</option>
                </select>
              </div>

              <div>
                <select 
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-700 outline-none focus:border-emerald-500 transition-all shadow-xs cursor-pointer"
                >
                  <option value="newest">Sort: Newest</option>
                  <option value="clicks">Sort: Most Clicks</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name">Sort: Name A-Z</option>
                </select>
              </div>
            </div>

            {/* Select All Bar */}
            {filteredProducts.length > 0 && (
              <div className="mb-4 flex items-center justify-between px-2 text-xs font-semibold text-slate-500">
                <button 
                  onClick={toggleSelectAll} 
                  className="flex items-center gap-2 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  {selectedProductIds.length === filteredProducts.length ? (
                    <CheckSquare size={16} className="text-emerald-600" />
                  ) : (
                    <Square size={16} className="text-slate-400" />
                  )}
                  Select All ({filteredProducts.length})
                </button>
                <span>Showing {filteredProducts.length} of {products.length} products</span>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="animate-spin text-emerald-600" size={36} />
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white/70 backdrop-blur-md rounded-3xl border border-slate-200 text-center shadow-xs">
                <ShoppingBag size={48} className="text-emerald-600 opacity-40 mb-4 animate-bounce" />
                <h3 className="text-base font-bold text-slate-800">No Products Found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mb-6">No catalog items match your search or filter parameters.</p>
                <button 
                  onClick={openAddModal}
                  className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                >
                  + Add First Product
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              /* --- GRID VIEW --- */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => {
                  const isSelected = selectedProductIds.includes(product.id);
                  return (
                    <div 
                      key={product.id}
                      className={`group relative bg-white border ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200/90'} rounded-3xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full`}
                    >
                      {/* Checkbox select */}
                      <button 
                        onClick={() => toggleSelectAll ? toggleSelectProduct(product.id) : null}
                        className="absolute top-4 left-4 z-20 w-7 h-7 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center border border-slate-200 shadow-xs cursor-pointer"
                      >
                        {isSelected ? <CheckSquare size={16} className="text-emerald-600" /> : <Square size={16} className="text-slate-400" />}
                      </button>

                      {/* Card Image Header */}
                      <div className="h-52 bg-slate-50 relative border-b border-slate-100 overflow-hidden group">
                        {product.image_url ? (
                          <img 
                            src={product.image_url} 
                            alt={product.name} 
                            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-300 bg-gradient-to-br from-slate-50 to-emerald-50/30">
                            <ShoppingBag size={44} className="text-emerald-600/30 mb-1" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Image</span>
                          </div>
                        )}

                        {/* Top Right Badges */}
                        <div className="absolute top-4 right-4 flex flex-col gap-1.5 items-end">
                          <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider shadow-xs border ${getCategoryBadge(product.category)}`}>
                            {product.category || 'PHYSICAL'}
                          </span>
                          <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider border ${product.in_stock ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>

                        {/* Product Link Indicator Pill */}
                        {product.product_url && (
                          <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-700 border border-slate-200/80 shadow-xs flex items-center gap-1.5">
                            {getLinkTypeIcon(product.link_type)}
                            <span className="truncate max-w-[140px]">{product.cta_text || 'View Link'}</span>
                          </div>
                        )}
                      </div>

                      {/* Card Content Body */}
                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <h3 className="text-base font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">{product.name}</h3>
                            {product.brand && (
                              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider shrink-0">{product.brand}</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8 leading-relaxed">{product.description || 'No description provided.'}</p>

                          {/* Price & SKU */}
                          <div className="flex items-baseline justify-between mb-4">
                            <div>
                              <span className="text-xl font-black text-slate-900">${product.price}</span>
                              {product.discount_price && (
                                <span className="text-xs text-slate-400 line-through ml-2">${product.discount_price}</span>
                              )}
                            </div>
                            {product.sku && (
                              <span className="text-[10px] font-mono font-bold text-slate-400">SKU: {product.sku}</span>
                            )}
                          </div>
                        </div>

                        {/* Card Footer Quick Actions */}
                        <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => { setSelectedProduct(product); setDrawerOpen(true); }}
                              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                              title="View Details"
                            >
                              <Eye size={14} />
                            </button>
                            <button 
                              onClick={() => openEditModal(product)}
                              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                              title="Edit Product"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button 
                              onClick={() => { setActiveQrProduct(product); setQrModalOpen(true); }}
                              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                              title="QR Code"
                            >
                              <QrCode size={14} />
                            </button>
                            <button 
                              onClick={() => handleCopyLink(product)}
                              className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
                              title="Copy Link"
                            >
                              {copiedId === product.id ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                            </button>
                            <button 
                              onClick={() => handleShareWhatsApp(product)}
                              className="p-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-xs transition-colors cursor-pointer"
                              title="Share to WhatsApp"
                            >
                              <Share2 size={14} />
                            </button>
                            {/* Checkout Link Button */}
                            <button
                              onClick={() => {
                                if (razorpayConnected) {
                                  handleCopyCheckoutLink(product);
                                } else {
                                  if (typeof window !== 'undefined') {
                                    window.location.href = '/client/payments';
                                  }
                                }
                              }}
                              className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                                razorpayConnected
                                  ? copiedCheckoutId === product.id
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                  : 'bg-slate-50 text-slate-400 hover:bg-amber-50 hover:text-amber-600'
                              }`}
                              title={
                                razorpayConnected
                                  ? copiedCheckoutId === product.id
                                    ? 'Checkout link copied!'
                                    : 'Copy Razorpay Checkout Link'
                                  : 'Connect Razorpay to get checkout link'
                              }
                            >
                              {copiedCheckoutId === product.id
                                ? <Check size={14} />
                                : <CreditCard size={14} />}
                            </button>
                          </div>

                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-all cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* --- LIST VIEW --- */
              <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-4 w-10">
                        <input type="checkbox" checked={selectedProductIds.length === filteredProducts.length} onChange={toggleSelectAll} />
                      </th>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Product Link</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <input type="checkbox" checked={selectedProductIds.includes(product.id)} onChange={() => toggleSelectProduct(product.id)} />
                        </td>
                        <td className="p-4 flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                            {product.image_url ? <img src={product.image_url} alt="" className="w-full h-full object-cover" /> : <ShoppingBag className="m-2.5 text-slate-400" size={20} />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900">{product.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">SKU: {product.sku || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 text-[8px] font-black rounded-full uppercase border ${getCategoryBadge(product.category)}`}>
                            {product.category}
                          </span>
                        </td>
                        <td className="p-4 font-black text-slate-900">${product.price}</td>
                        <td className="p-4">
                          {product.product_url ? (
                            <a href={product.product_url} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-emerald-600 hover:underline font-bold text-xs">
                              {getLinkTypeIcon(product.link_type)}
                              <span className="truncate max-w-[120px]">{product.cta_text || 'Link'}</span>
                            </a>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">No Link</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md ${product.in_stock ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => openEditModal(product)} className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg"><Edit3 size={14} /></button>
                            <button onClick={() => handleDelete(product.id)} className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg"><Trash2 size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* --- ANALYTICS DASHBOARD TAB --- */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Catalog Views</p>
                <h3 className="text-3xl font-black text-slate-900">{analyticsData?.total_views || 0}</h3>
                <p className="text-[10px] font-semibold text-emerald-600 mt-2">↑ High Engagement</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Total Link Clicks</p>
                <h3 className="text-3xl font-black text-slate-900">{analyticsData?.total_link_clicks || 0}</h3>
                <p className="text-[10px] font-semibold text-blue-600 mt-2">CTR: {analyticsData?.ctr || 0}%</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Button Clicks</p>
                <h3 className="text-3xl font-black text-slate-900">{analyticsData?.total_button_clicks || 0}</h3>
                <p className="text-[10px] font-semibold text-purple-600 mt-2">CTA Interactions</p>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Catalog Revenue</p>
                <h3 className="text-3xl font-black text-emerald-600">${analyticsData?.total_revenue || 0.00}</h3>
                <p className="text-[10px] font-semibold text-slate-500 mt-2">Tracked via Link Conversion</p>
              </div>
            </div>

            {/* Top Performing Table */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
              <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Zap size={18} className="text-amber-500" /> Top Performing Products & Links
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-slate-700">
                  <thead className="bg-slate-50 uppercase text-[9px] font-black text-slate-400 tracking-wider">
                    <tr>
                      <th className="p-3">Product Name</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Views</th>
                      <th className="p-3">Total Clicks</th>
                      <th className="p-3">Product URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(analyticsData?.top_products || []).map((tp, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="p-3 font-bold text-slate-900">{tp.name}</td>
                        <td className="p-3 font-black text-emerald-600">${tp.price}</td>
                        <td className="p-3">{tp.views}</td>
                        <td className="p-3 font-bold text-blue-600">{tp.clicks}</td>
                        <td className="p-3">
                          {tp.product_url ? (
                            <a href={tp.product_url} target="_blank" rel="noreferrer" className="text-emerald-600 hover:underline flex items-center gap-1">
                              <ExternalLink size={12} /> {tp.cta_text || 'View Link'}
                            </a>
                          ) : 'No Link'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* --- ADD / EDIT PRODUCT MODAL (4 TABS) --- */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <form onSubmit={handleSaveProduct} className="relative bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                    <ShoppingBag size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{editingId ? 'Edit Product Catalog Item' : 'Create Catalog Product'}</h3>
                    <p className="text-xs text-slate-500">Configure product parameters, target URL, CTA buttons, and assets</p>
                  </div>
                </div>
                <button type="button" onClick={() => setModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              {/* Modal Sub-Tabs */}
              <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-100 bg-white">
                <button 
                  type="button"
                  onClick={() => setModalTab('basic')}
                  className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer ${modalTab === 'basic' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  Basic Info
                </button>
                <button 
                  type="button"
                  onClick={() => setModalTab('media')}
                  className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer ${modalTab === 'media' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  Media & Assets
                </button>
                <button 
                  type="button"
                  onClick={() => setModalTab('link')}
                  className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${modalTab === 'link' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  <ExternalLink size={13} /> Product Link & CTA
                </button>
                <button 
                  type="button"
                  onClick={() => setModalTab('specs')}
                  className={`pb-3 text-xs font-black transition-all border-b-2 cursor-pointer ${modalTab === 'specs' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  Specifications
                </button>
              </div>

              {/* Modal Content Body */}
              <div className="p-6 overflow-y-auto flex-1 space-y-4">
                
                {/* --- TAB 1: BASIC INFO --- */}
                {modalTab === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Product Name *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        placeholder="e.g. AI Automation Playbook E-Book"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Price ($) *</label>
                        <input 
                          type="number" 
                          step="0.01"
                          required
                          value={formData.price}
                          onChange={e => setFormData({...formData, price: e.target.value})}
                          placeholder="29.99"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Discount Price ($)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          value={formData.discount_price}
                          onChange={e => setFormData({...formData, discount_price: e.target.value})}
                          placeholder="19.99"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Category</label>
                        <select 
                          value={formData.category}
                          onChange={e => setFormData({...formData, category: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                        >
                          <option value="PHYSICAL">Physical Product</option>
                          <option value="DIGITAL">Digital Product</option>
                          <option value="BOOK">Book / E-Book</option>
                          <option value="SERVICE">Service</option>
                          <option value="OTHER">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Brand</label>
                        <input 
                          type="text" 
                          value={formData.brand}
                          onChange={e => setFormData({...formData, brand: e.target.value})}
                          placeholder="e.g. UWO Connect"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">SKU Code</label>
                        <input 
                          type="text" 
                          value={formData.sku}
                          onChange={e => setFormData({...formData, sku: e.target.value})}
                          placeholder="PROD-AI-001"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Description</label>
                      <textarea 
                        rows={3}
                        value={formData.description}
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Detailed description of the product for customers and AI auto-reply..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* --- TAB 2: MEDIA & ASSETS --- */}
                {modalTab === 'media' && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Main Image URL</label>
                      <input 
                        type="url" 
                        value={formData.image_url}
                        onChange={e => setFormData({...formData, image_url: e.target.value})}
                        placeholder="https://example.com/image.jpg"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    {formData.image_url && (
                      <div className="w-32 h-32 rounded-2xl border border-slate-200 overflow-hidden bg-slate-100">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Video Demo URL (YouTube / Vimeo / MP4)</label>
                      <input 
                        type="url" 
                        value={formData.video_url}
                        onChange={e => setFormData({...formData, video_url: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">PDF Brochure / Document Link</label>
                      <input 
                        type="url" 
                        value={formData.pdf_brochure_url}
                        onChange={e => setFormData({...formData, pdf_brochure_url: e.target.value})}
                        placeholder="https://example.com/brochure.pdf"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* --- TAB 3: PRODUCT LINK & CTA (NEW SECTION) --- */}
                {modalTab === 'link' && (
                  <div className="space-y-5">
                    <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
                      <h4 className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                        <Zap size={14} className="text-emerald-600" /> WhatsApp Commerce & Direct Link Integration
                      </h4>
                      <p className="text-[11px] text-emerald-800 leading-relaxed">
                        When users interact on WhatsApp or AI agents recommend this product, UWOConnect attaches this link & CTA button automatically.
                      </p>
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Target Product URL</label>
                      <input 
                        type="url" 
                        value={formData.product_url}
                        onChange={e => handleProductUrlChange(e.target.value)}
                        placeholder="https://example.com/product or Shopify/Amazon link"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Link Type</label>
                        <select 
                          value={formData.link_type}
                          onChange={e => setFormData({...formData, link_type: e.target.value})}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all cursor-pointer"
                        >
                          <option value="WEBSITE">Website</option>
                          <option value="BUY_NOW">Buy Now</option>
                          <option value="CHECKOUT">Checkout</option>
                          <option value="PAYMENT">Payment</option>
                          <option value="BOOKING">Booking Page</option>
                          <option value="DOWNLOAD">Download PDF</option>
                          <option value="VIDEO">Video Demo</option>
                          <option value="EXTERNAL_MARKETPLACE">Shopify / Amazon / Flipkart</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">CTA Button Text</label>
                        <input 
                          type="text" 
                          value={formData.cta_text}
                          onChange={e => setFormData({...formData, cta_text: e.target.value})}
                          placeholder="e.g. View Product / Buy Now"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-xs font-semibold text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        />
                      </div>
                    </div>

                    {/* LIVE WHATSAPP & BUTTON PREVIEW */}
                    <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Live WhatsApp Customer Chat Preview</p>
                      
                      <div className="bg-[#DCF8C6]/80 border border-emerald-300 p-4 rounded-2xl max-w-sm font-sans shadow-xs">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-bold text-slate-900">📦 {formData.name || 'Sample Product'}</span>
                          <span className="text-xs font-black text-emerald-800">${formData.price || '0.00'}</span>
                        </div>
                        <p className="text-[11px] text-slate-700 line-clamp-2 mb-3">{formData.description || 'Product description will appear here...'}</p>
                        
                        <div className="pt-2 border-t border-emerald-300/60 text-center">
                          <span className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-xs">
                            [ {formData.cta_text || 'View Product'} ]
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* --- TAB 4: SPECIFICATIONS --- */}
                {modalTab === 'specs' && (
                  <div className="space-y-4">
                    <p className="text-xs text-slate-500">Add technical specs or product properties (e.g., Weight, Format, License)</p>
                    
                    <div className="grid grid-cols-5 gap-2">
                      <input 
                        type="text" 
                        placeholder="Key (e.g. Pages)" 
                        value={newSpecKey} 
                        onChange={e => setNewSpecKey(e.target.value)} 
                        className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                      />
                      <input 
                        type="text" 
                        placeholder="Value (e.g. 240)" 
                        value={newSpecVal} 
                        onChange={e => setNewSpecVal(e.target.value)} 
                        className="col-span-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold"
                      />
                      <button 
                        type="button" 
                        onClick={() => {
                          if (newSpecKey && newSpecVal) {
                            setFormData({...formData, specifications: {...formData.specifications, [newSpecKey]: newSpecVal}});
                            setNewSpecKey(''); setNewSpecVal('');
                          }
                        }}
                        className="bg-emerald-600 text-white rounded-xl font-bold text-xs hover:bg-emerald-700 cursor-pointer"
                      >
                        + Add
                      </button>
                    </div>

                    <div className="space-y-2 pt-2">
                      {Object.entries(formData.specifications || {}).map(([k, v]) => (
                        <div key={k} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                          <span className="font-bold text-slate-700">{k}:</span>
                          <span className="text-slate-600">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions */}
              <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-100 rounded-2xl font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={14} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* --- BULK OPERATIONS MODAL --- */}
        {bulkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setBulkModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6">
              <h3 className="text-base font-bold text-slate-900 mb-2">Bulk Update ({selectedProductIds.length} Products)</h3>
              <div className="space-y-4 my-4">
                <div>
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Bulk Action Type</label>
                  <select 
                    value={bulkActionType}
                    onChange={e => setBulkActionType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold"
                  >
                    <option value="update_price">Update Price / Discount</option>
                    <option value="update_category">Change Category</option>
                    <option value="update_link">Update Target Link & CTA</option>
                    <option value="delete">Delete Selected Products</option>
                  </select>
                </div>

                {bulkActionType === 'update_price' && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Price ($)</label>
                    <input 
                      type="number" 
                      value={bulkPayload.price} 
                      onChange={e => setBulkPayload({...bulkPayload, price: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold"
                    />
                  </div>
                )}

                {bulkActionType === 'update_category' && (
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">New Category</label>
                    <select 
                      value={bulkPayload.category} 
                      onChange={e => setBulkPayload({...bulkPayload, category: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 text-xs font-semibold"
                    >
                      <option value="PHYSICAL">Physical Product</option>
                      <option value="DIGITAL">Digital Product</option>
                      <option value="BOOK">Book / E-Book</option>
                      <option value="SERVICE">Service</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setBulkModalOpen(false)} className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold">Cancel</button>
                <button onClick={handleExecuteBulkAction} className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">Apply Bulk Action</button>
              </div>
            </div>
          </div>
        )}

        {/* --- QR CODE MODAL --- */}
        {qrModalOpen && activeQrProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div onClick={() => setQrModalOpen(false)} className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />
            <div className="relative bg-white border border-slate-200 w-full max-w-sm rounded-3xl shadow-2xl p-6 text-center">
              <h3 className="text-base font-bold text-slate-900 mb-1">{activeQrProduct.name}</h3>
              <p className="text-xs text-slate-500 mb-4">Scan QR Code to open Product Link</p>
              
              <div className="w-48 h-48 mx-auto bg-slate-100 rounded-2xl border border-slate-200 flex items-center justify-center mb-4">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/products/${activeQrProduct.id}/redirect_link/`)}`} 
                  alt="QR Code"
                  className="w-44 h-44 object-contain"
                />
              </div>

              <div className="flex gap-2">
                <button onClick={() => handleCopyLink(activeQrProduct)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-2xl font-bold text-xs text-slate-700">Copy Link</button>
                <button onClick={() => setQrModalOpen(false)} className="px-5 py-2.5 bg-emerald-600 text-white rounded-2xl font-bold text-xs">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

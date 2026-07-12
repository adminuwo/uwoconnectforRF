'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Plus, Loader2, Trash2, Tag, Check, DollarSign, Upload, FileText } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function CatalogPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'PHYSICAL',
    description: '',
    image_url: '',
    in_stock: true
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/products/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(res.data || []);
    } catch (err) {
      console.error('Failed to fetch products', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;
    try {
      setIsSaving(true);
      const token = localStorage.getItem('token');
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/products/`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setModalOpen(false);
      setFormData({ name: '', price: '', category: 'PHYSICAL', description: '', image_url: '', in_stock: true });
      fetchProducts();
    } catch (err) {
      alert('Failed to create product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/products/${id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (err) {
      alert('Failed to delete product');
    }
  };

  const handleCSVImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setImporting(true);
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/products/import_csv/`, 
        formData, 
        {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );
      alert(res.data.message || 'CSV imported successfully!');
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to import CSV');
    } finally {
      setImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const getCategoryBadge = (cat) => {
    switch (cat) {
      case 'DIGITAL':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'BOOK':
        return 'bg-purple-50 text-purple-700 border border-purple-200';
      case 'SERVICE':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'PHYSICAL':
      default:
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto pb-20 px-4 md:px-0 font-sans text-slate-800">
        
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Product Catalog</h1>
            <p className="text-slate-500 font-medium italic text-xs sm:text-sm">Manage items available for customer checkout on WhatsApp.</p>
          </div>
          <div className="flex items-center gap-3">
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
              className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-2xl font-bold text-xs transition-all cursor-pointer disabled:opacity-50 shadow-sm"
            >
              {importing ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              Import CSV
            </button>
            <button 
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-[#059669] text-white rounded-2xl font-bold text-xs shadow-[0_4px_20px_rgba(16,185,129,0.15)] transition-all cursor-pointer"
            >
              <Plus size={16} />
              Add Product
            </button>
          </div>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 text-center shadow-sm">
            <ShoppingBag size={48} className="text-emerald-600 opacity-40 mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800">Your Catalog is Empty</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">Upload products manually or upload a CSV file with "Name, Price, Category, Description, ImageURL" headers.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div 
                key={product.id}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden group hover:border-emerald-500/20 transition-all shadow-sm hover:shadow-md flex flex-col h-full"
              >
                {/* Image Placeholder */}
                <div className="h-48 bg-slate-50 flex items-center justify-center relative border-b border-slate-100">
                  {product.image_url ? (
                    <img 
                      src={product.image_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ShoppingBag size={40} className="text-emerald-600 opacity-20" />
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-2.5 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider ${getCategoryBadge(product.category)}`}>
                      {product.category || 'PHYSICAL'}
                    </span>
                  </div>
                  <span className={`absolute top-4 right-4 px-2.5 py-0.5 text-[8px] font-black rounded-full uppercase tracking-wider ${product.in_stock ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                    {product.in_stock ? 'In Stock' : 'Out of'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 line-clamp-1 mb-1">{product.name}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 h-8">{product.description || 'No description provided.'}</p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-lg font-black text-emerald-600">${product.price}</span>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 bg-red-50 text-red-600 hover:text-white hover:bg-red-600 rounded-xl transition-all cursor-pointer"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Modal */}
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div onClick={() => setModalOpen(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <form onSubmit={handleCreate} className="relative bg-white border border-slate-200 w-full max-w-md rounded-3xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><ShoppingBag className="text-emerald-600" size={20}/> New Catalog Item</h3>
                <p className="text-xs text-slate-500 mt-1 font-medium">Fill in the product details to add to catalog.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Product Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm font-semibold"
                    placeholder="e.g. Premium Membership Pack"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Price ($) *</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      required 
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: e.target.value})} 
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm font-semibold"
                      placeholder="e.g. 49.99"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Stock Status</label>
                    <select 
                      value={formData.in_stock ? "true" : "false"}
                      onChange={e => setFormData({...formData, in_stock: e.target.value === "true"})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-700 focus:border-emerald-500 transition-all text-sm font-semibold"
                    >
                      <option value="true">In Stock</option>
                      <option value="false">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Category</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-700 focus:border-emerald-500 transition-all text-sm font-semibold"
                    >
                      <option value="PHYSICAL">Physical Product</option>
                      <option value="DIGITAL">Digital Product</option>
                      <option value="BOOK">Book / E-Book</option>
                      <option value="SERVICE">Service</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Image URL (Optional)</label>
                  <input 
                    type="url" 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm font-semibold"
                    placeholder="e.g. https://domain.com/image.png"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 block ml-1">Description</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 outline-none text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all text-sm font-semibold h-20 resize-none"
                    placeholder="Short description of the item..."
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 rounded-2xl text-xs font-bold text-slate-600 transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-[#059669] text-white rounded-2xl text-xs font-bold shadow-[0_4px_12px_rgba(16,185,129,0.15)] disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14}/>}
                  Save Item
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

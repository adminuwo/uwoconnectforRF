'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Loader2, DollarSign,
  Package, Tag, ExternalLink, Eye, ChevronRight,
  Sparkles, Building2, CheckCircle2, AlertCircle, X,
  Layers, ArrowUpRight, Filter, Plus
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminProductsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'HAS_PRODUCTS' | 'NO_PRODUCTS'
  const [selectedClient, setSelectedClient] = useState(null);
  const [modalSearch, setModalSearch] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/admin/all-products/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      console.error('Failed to fetch product metrics', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const kpis = data?.kpis || {};
  const clients = data?.clients || [];

  // Filtered clients list
  const filteredClients = useMemo(() => {
    return clients.filter(c => {
      const q = searchQuery.toLowerCase();
      const nameMatch = (c.client_name || '').toLowerCase().includes(q) ||
                        (c.company_name || '').toLowerCase().includes(q) ||
                        (c.products || []).some(p => (p.name || '').toLowerCase().includes(q) || (p.sku || '').toLowerCase().includes(q));

      if (!nameMatch) return false;

      if (statusFilter === 'HAS_PRODUCTS') return c.total_products > 0;
      if (statusFilter === 'NO_PRODUCTS') return c.total_products === 0;
      return true;
    });
  }, [clients, searchQuery, statusFilter]);

  // Selected client's products filtered by modal search
  const modalProducts = useMemo(() => {
    if (!selectedClient) return [];
    if (!modalSearch) return selectedClient.products || [];
    const q = modalSearch.toLowerCase();
    return (selectedClient.products || []).filter(p => 
      (p.name || '').toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [selectedClient, modalSearch]);

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-7xl mx-auto pb-24 px-4 sm:px-6 lg:px-8 font-sans text-slate-800 space-y-6">
        
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 pb-2 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <ShoppingBag size={20} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Client Product Catalogs
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Monitor total products listed by each client workspace and view their inventory.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Refresh
            </button>
            <Link
              href="/admin/clients"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all"
            >
              <span>Manage Clients</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Summary Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Card 1: Total Listed Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Package size={24} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Products</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpis.totalProducts ?? 0}</h3>
              <p className="text-[10px] text-emerald-600 font-bold mt-0.5">Across all client stores</p>
            </div>
          </div>

          {/* Card 2: Active Client Catalogs */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
              <Building2 size={24} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Active Stores</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpis.totalClientsWithProducts ?? 0}</h3>
              <p className="text-[10px] text-slate-500 font-medium mt-0.5">Clients with listed items</p>
            </div>
          </div>

          {/* Card 3: In Stock Products */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">In-Stock Items</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpis.inStockProducts ?? 0}</h3>
              <p className="text-[10px] text-blue-600 font-bold mt-0.5">Available for sale</p>
            </div>
          </div>

          {/* Card 4: Total Clients */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Total Workspaces</p>
              <h3 className="text-2xl font-black text-slate-900 mt-0.5">{kpis.totalClients ?? clients.length}</h3>
              <p className="text-[10px] text-purple-600 font-bold mt-0.5">Client accounts</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full max-w-md">
            <Search size={15} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client name, company, or product..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500 text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="ALL">All Clients ({clients.length})</option>
              <option value="HAS_PRODUCTS">With Products ({kpis.totalClientsWithProducts ?? 0})</option>
              <option value="NO_PRODUCTS">Zero Products ({Math.max((kpis.totalClients || clients.length) - (kpis.totalClientsWithProducts || 0), 0)})</option>
            </select>
          </div>
        </div>

        {/* Client Product Matrix Table */}
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="animate-spin text-emerald-500 mx-auto" size={28} />
              <p className="text-xs text-slate-400 mt-2 font-medium">Loading client product catalogs...</p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <ShoppingBag size={24} />
              </div>
              <h4 className="font-extrabold text-slate-800 text-sm">No Client Catalogs Found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                No clients match your search criteria. Try resetting the filters.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              
              {/* Table Header */}
              <div className="grid grid-cols-12 px-6 py-4 bg-slate-50/80 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-100 items-center">
                <div className="col-span-4">Client Workspace</div>
                <div className="col-span-3 text-center">Total Products Listed</div>
                <div className="col-span-3">Product Categories</div>
                <div className="col-span-2 text-right">Catalog Details</div>
              </div>

              {/* Client Rows */}
              {filteredClients.map((client) => {
                const hasProducts = client.total_products > 0;

                return (
                  <div
                    key={client.client_id}
                    onClick={() => setSelectedClient(client)}
                    className="grid grid-cols-12 px-6 py-4 items-center hover:bg-emerald-50/30 transition-colors cursor-pointer text-xs"
                  >
                    {/* Client Name & Workspace */}
                    <div className="col-span-4 flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-2xl font-black flex items-center justify-center text-xs shrink-0 shadow-2xs",
                        hasProducts ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"
                      )}>
                        {(client.client_name || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 truncate flex items-center gap-1.5">
                          <span>{client.client_name}</span>
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-bold text-[10px] rounded-md">
                            {client.plan || 'Free'}
                          </span>
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{client.company_name || 'Individual Workspace'}</p>
                      </div>
                    </div>

                    {/* Total Products Count Badge */}
                    <div className="col-span-3 text-center">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-800 border border-slate-200">
                        <Package size={13} className={hasProducts ? "text-emerald-600" : "text-slate-400"} />
                        <span>{client.total_products} Products</span>
                      </div>
                      {hasProducts && (
                        <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                          {client.active_products} In Stock
                        </span>
                      )}
                    </div>

                    {/* Product Categories */}
                    <div className="col-span-3 flex items-center gap-1.5 flex-wrap">
                      {client.categories && client.categories.length > 0 ? (
                        client.categories.map((cat, idx) => (
                          <span 
                            key={idx} 
                            className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold text-[10px] rounded-lg"
                          >
                            {cat}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-400 text-[11px] italic">No categories</span>
                      )}
                    </div>

                    {/* Action Button */}
                    <div className="col-span-2 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedClient(client);
                        }}
                        className={cn(
                          "px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs",
                          hasProducts
                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                            : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                        )}
                      >
                        <Eye size={13} />
                        <span>View ({client.total_products})</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* CENTER POPUP MODAL: CLIENT PRODUCT CATALOG DETAILS                        */}
        {/* ========================================================================= */}
        {selectedClient && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div 
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              
              {/* Modal Top Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center text-base shadow-sm">
                    {(selectedClient.client_name || 'C').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="font-extrabold text-slate-900 text-base">{selectedClient.client_name}</h2>
                      <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[11px] rounded-md border border-emerald-100">
                        {selectedClient.plan || 'Standard'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {selectedClient.total_products} Total Listed Products • {selectedClient.active_products} In Stock
                    </p>
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedClient(null)} 
                  className="w-9 h-9 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors cursor-pointer"
                  title="Close modal"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Filter Toolbar */}
              <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between gap-3 shrink-0">
                <div className="relative flex-1 max-w-md">
                  <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    value={modalSearch}
                    onChange={(e) => setModalSearch(e.target.value)}
                    placeholder="Search inside this client's products..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600">
                    Showing <span className="text-emerald-700 font-black">{modalProducts.length}</span> of {selectedClient.total_products} items
                  </span>
                </div>
              </div>

              {/* Modal Body: Products Grid / List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3.5">
                {modalProducts.length === 0 ? (
                  <div className="text-center py-16 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <ShoppingBag size={24} />
                    </div>
                    <h4 className="font-extrabold text-slate-800 text-sm">No Products Listed</h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {selectedClient.client_name} has not added any products to their store yet.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {modalProducts.map((prd) => (
                      <div 
                        key={prd.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-3 hover:border-emerald-200 transition-all flex flex-col justify-between"
                      >
                        <div>
                          {/* Product Title & Category */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h4 className="font-extrabold text-slate-900 text-sm">{prd.name}</h4>
                              {prd.sku && (
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">SKU: {prd.sku}</p>
                              )}
                            </div>
                            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-md border border-emerald-100 shrink-0">
                              {prd.category}
                            </span>
                          </div>

                          {/* Description */}
                          {prd.description && (
                            <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                              {prd.description}
                            </p>
                          )}
                        </div>

                        {/* Price & Stock Footer */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <span className="text-sm font-black text-slate-900">
                              ${prd.price.toFixed(2)}
                            </span>
                            {prd.discount_price && (
                              <span className="text-xs text-slate-400 line-through ml-2 font-medium">
                                ${prd.discount_price.toFixed(2)}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "px-2 py-0.5 text-[10px] font-extrabold rounded-md",
                              prd.in_stock 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                                : "bg-rose-50 text-rose-700 border border-rose-200"
                            )}>
                              {prd.in_stock ? `In Stock (${prd.stock_quantity ?? 'Yes'})` : 'Out of Stock'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
                <span className="text-xs text-slate-400">
                  Client ID: <span className="font-mono text-slate-600">{selectedClient.client_id}</span>
                </span>
                <button
                  onClick={() => setSelectedClient(null)}
                  className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default AdminProductsPage;


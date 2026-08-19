'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, Search, Loader2, DollarSign,
  Package, Tag, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminProductsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/overview/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch product metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverview();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-7xl mx-auto pb-24 px-4 sm:px-6 font-sans">
        
        {/* Header */}
        <div className="my-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-widest rounded-full">
              Commerce & Catalog
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Platform Product Catalog
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic">
            Overview of client product inventories, digital downloads, and e-commerce listings.
          </p>
        </div>

        {/* Metric Card */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm mb-8 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShoppingBag size={28} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Active Products</p>
              <h3 className="text-3xl font-black text-slate-900">{kpis.totalProducts ?? 0} Listed Items</h3>
            </div>
          </div>
          <Link
            href="/admin/clients"
            className="px-5 py-3 bg-[#059669] text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-[#047857] transition-all"
          >
            Manage by Client &rarr;
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminProductsPage;

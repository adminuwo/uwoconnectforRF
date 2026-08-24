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
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between my-4 pb-3 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Platform Product Catalog
          </h1>
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

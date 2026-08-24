'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CreditCard, DollarSign, Search, Loader2,
  CheckCircle2, Clock, XCircle, ShoppingBag
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminSalesPage = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchSales = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/all-sales/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSales(res.data || []);
      } catch (err) {
        console.error('Failed to fetch platform sales', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSales();
  }, []);

  const filteredSales = sales.filter(s =>
    s.client_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.product_name?.toLowerCase().includes(search.toLowerCase()) ||
    s.customer_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between my-4 pb-3 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sales & Orders Management
          </h1>
        </div>

        {/* Search */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search sales by product, customer, or client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none text-xs font-bold focus:border-[#059669]"
            />
          </div>
        </div>

        {/* Sales Table */}
        <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
          {loading ? (
            <div className="py-28 flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-[#059669]" size={36} />
              <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading transactions...</p>
            </div>
          ) : filteredSales.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-xs font-medium italic">
              No sales transactions found.
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-black tracking-wider">
                    <th className="p-4 pl-6">Client Workspace</th>
                    <th className="p-4">Product / Item</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4 text-center">Status</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4 pr-6 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  {filteredSales.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/50">
                      <td className="p-4 pl-6 font-bold text-slate-900">{s.client_name}</td>
                      <td className="p-4 text-slate-800 font-medium">{s.product_name}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-900">{s.customer_name}</p>
                        <p className="text-[10px] text-slate-400">{s.customer_email}</p>
                      </td>
                      <td className="p-4 font-black text-slate-900">₹{s.amount.toLocaleString()}</td>
                      <td className="p-4 text-center">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase",
                          s.payment_status === 'PAID' ? "bg-emerald-100 text-[#059669]" : "bg-amber-100 text-amber-800"
                        )}>
                          {s.payment_status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{s.payment_method}</td>
                      <td className="p-4 pr-6 text-right text-slate-400">{new Date(s.created_at).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminSalesPage;

'use client';

import React, { useState, useEffect } from 'react';
import { Receipt, Loader2, DollarSign, User, Calendar, Tag, ShieldAlert } from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/orders/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data || []);
    } catch (err) {
      console.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusStyle = (status) => {
    switch (status.toUpperCase()) {
      case 'PAID':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'FAILED':
      default:
        return 'bg-red-50 text-red-700 border border-red-200';
    }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 pb-20 font-sans text-slate-800">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Orders & Sales</h1>
          <p className="text-slate-500 font-medium italic text-sm">Track sales and transaction status collected from WhatsApp checkout automation flows.</p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="animate-spin text-emerald-600" size={36} />
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-slate-100 text-center shadow-sm">
            <Receipt size={48} className="text-emerald-600 opacity-40 mb-4 animate-pulse" />
            <h3 className="text-base font-bold text-slate-800">No Orders Placed Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">When users buy items from your automation flows, their sales entries will show up here.</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Details</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Products Ordered</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Amount</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Date & Time</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5 text-sm font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-slate-800">{order.contact_name || 'Anonymous User'}</span>
                          <span className="text-xs text-slate-400 mt-0.5">{order.contact_phone || 'No phone'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        <div className="flex flex-col gap-1">
                          {order.items && Array.isArray(order.items) && order.items.map((item, idx) => (
                            <span key={idx} className="text-xs text-slate-700 font-medium line-clamp-1">
                              {item.name} <span className="text-slate-400">x{item.quantity || 1}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-sm font-black text-emerald-600">
                        ${order.total_amount}
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 text-[9px] font-black rounded-full uppercase tracking-wider ${getStatusStyle(order.payment_status)}`}>
                          {order.payment_status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <a
                          href={`/client/invoices?search=${order.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all shadow-2xs no-underline"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Invoice PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

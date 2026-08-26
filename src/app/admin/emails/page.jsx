'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Mail, Search, Loader2, CheckCircle2, Clock,
  ArrowUpRight, ArrowDownLeft, Globe
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const AdminEmailsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmailsData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/overview/`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error('Failed to fetch email metrics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmailsData();
  }, []);

  const kpis = data?.kpis || {};

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between my-4 pb-3 border-b border-slate-100">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Email & Gmail Integration Control
          </h1>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Mail size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Email Messages</p>
                <h3 className="text-3xl font-black text-slate-900">{kpis.totalEmails ?? 0}</h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
                <Globe size={28} />
              </div>
              <div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Connected Gmail Accounts</p>
                <h3 className="text-3xl font-black text-slate-900">{kpis.totalGmailConnections ?? 0}</h3>
              </div>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default AdminEmailsPage;

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Search, Users, MessageSquare, ShieldCheck, FileText,
  Receipt, ShoppingBag, Brain, Loader2, ArrowRight, Mail,
  Smartphone, Filter, ExternalLink
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const GlobalAdminSearchPage = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/global-search/`, {
          headers: { Authorization: `Bearer ${token}` },
          params: { q: query.trim() }
        });
        setResults(res.data.results || []);
      } catch (err) {
        console.error('Failed to perform global search', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(delayDebounce);
  }, [query]);

  const categories = ['ALL', 'Clients', 'Team Members', 'Messages', 'Quotations', 'Proposals', 'Invoices', 'Products', 'Knowledge Base', 'Emails'];

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Clients': return Users;
      case 'Team Members': return ShieldCheck;
      case 'Messages': return MessageSquare;
      case 'Quotations': return FileText;
      case 'Proposals': return FileText;
      case 'Invoices': return Receipt;
      case 'Products': return ShoppingBag;
      case 'Knowledge Base': return Brain;
      case 'Emails': return Mail;
      default: return Search;
    }
  };

  const filteredResults = results.filter(
    r => selectedCategory === 'ALL' || r.category === selectedCategory
  );

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-24 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Header */}
        <div className="my-8 text-center">
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 bg-emerald-100 text-[#059669] text-[10px] font-black uppercase tracking-widest rounded-full">
            Command Search
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Global Admin Search
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-1 italic max-w-xl mx-auto">
            Instantly query across clients, team members, live messages, quotations, proposals, invoices, products, emails, and knowledge documents.
          </p>
        </div>

        {/* Search Bar Input */}
        <div className="bg-white p-3 sm:p-4 rounded-3xl border border-slate-200 shadow-lg mb-6 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-4 text-[#059669]" size={22} />
            <input
              type="text"
              autoFocus
              placeholder="Type anything (e.g. Acme, #INV-1001, John, +91, Proposal, WhatsApp, Gmail)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-14 pr-12 py-4 text-base font-bold text-slate-900 placeholder:text-slate-300 outline-none"
            />
            {loading && (
              <Loader2 className="absolute right-4 animate-spin text-[#059669]" size={20} />
            )}
          </div>
        </div>

        {/* Category Pills */}
        {results.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto custom-scrollbar pb-3 mb-6 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer",
                  selectedCategory === cat
                    ? "bg-[#059669] text-white shadow-xs"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                )}
              >
                {cat} {cat !== 'ALL' && `(${results.filter(r => r.category === cat).length})`}
              </button>
            ))}
          </div>
        )}

        {/* Results List */}
        {filteredResults.length > 0 && (
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-4 sm:p-6 space-y-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-4 mb-2">
              Found {filteredResults.length} records matching "{query}"
            </p>
            {filteredResults.map((item, idx) => {
              const Icon = getCategoryIcon(item.category);
              return (
                <Link
                  key={idx}
                  href={item.link}
                  className="p-4 rounded-2xl bg-slate-50/60 hover:bg-emerald-50/50 border border-slate-100 hover:border-emerald-200 flex items-center justify-between transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-700 group-hover:text-[#059669] flex items-center justify-center shadow-xs">
                      <Icon size={18} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-slate-900 group-hover:text-[#059669] transition-colors">{item.title}</span>
                        <span className="px-2 py-0.5 rounded text-[9px] font-black uppercase bg-slate-200 text-slate-700">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-[#059669] group-hover:translate-x-1 transition-all" />
                </Link>
              );
            })}
          </div>
        )}

        {query.length >= 2 && !loading && results.length === 0 && (
          <div className="bg-white rounded-[32px] border border-slate-200 p-12 text-center text-slate-400 text-sm font-medium italic">
            No matching records found across platform workspaces.
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default GlobalAdminSearchPage;

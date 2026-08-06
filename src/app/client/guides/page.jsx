'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Search, Sparkles, Filter, Rocket, HelpCircle,
  Clock, ShieldCheck, CheckCircle2, ChevronRight, RefreshCw, Plus
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import GuideCard from '@/components/guides/GuideCard';
import LearningCenterModal from '@/components/guides/LearningCenterModal';

const LearningCenterPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeGuideSlug, setActiveGuideSlug] = useState(null);

  useEffect(() => {
    fetchGuides();
  }, []);

  const fetchGuides = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';

    try {
      const res = await axios.get(`${API_URL}/api/guides/`, { headers });
      if (Array.isArray(res.data)) {
        setGuides(res.data);
      } else if (res.data.results) {
        setGuides(res.data.results);
      }
    } catch (err) {
      console.error('Error fetching guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['ALL', 'Integrations', 'Marketing', 'Automation', 'Configuration', 'General', 'Social Media', 'Sales', 'Communication', 'AI & Training'];

  const filteredGuides = guides.filter(g => {
    const matchesCategory = selectedCategory === 'ALL' || g.category?.toUpperCase() === selectedCategory.toUpperCase();
    const matchesSearch = !searchQuery || g.title?.toLowerCase().includes(searchQuery.toLowerCase()) || g.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto pb-20 px-2 sm:px-4 md:px-0">
        
        {/* Banner */}
        <div className="mb-8 p-8 rounded-3xl bg-slate-950 text-white relative overflow-hidden border border-slate-800 shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 text-xs font-black uppercase tracking-widest">
              <Sparkles size={13} /> UWOConnect Learning Academy
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Interactive Learning Center & Step-by-Step Guides
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-medium">
              Explore interactive tutorials, architecture blueprints, code snippets, and step-by-step setup walkthroughs for every UWOConnect feature.
            </p>
          </div>
        </div>

        {/* Filters & Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search guides by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 placeholder-slate-400 text-xs rounded-2xl border border-slate-200 focus:outline-none focus:border-emerald-500 shadow-xs"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 custom-scroll">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Guides Grid */}
        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-400 text-xs font-semibold gap-3">
            <RefreshCw className="animate-spin text-emerald-600" size={24} />
            Loading Interactive Guides...
          </div>
        ) : filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGuides.map(guide => (
              <GuideCard
                key={guide.slug}
                guide={guide}
                onOpenGuide={(slug) => setActiveGuideSlug(slug)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <BookOpen size={36} className="mx-auto text-slate-300" />
            <h3 className="text-sm font-bold text-slate-800">No Learning Guides Found</h3>
            <p className="text-xs text-slate-400">Try adjusting your search query or category filter.</p>
          </div>
        )}

        {/* Interactive Guide Modal */}
        <LearningCenterModal
          guideSlug={activeGuideSlug}
          isOpen={!!activeGuideSlug}
          onClose={() => setActiveGuideSlug(null)}
        />
      </div>
    </DashboardLayout>
  );
};

export default LearningCenterPage;

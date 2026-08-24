'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen, Plus, Search, Edit3, Trash2, CheckCircle2, X,
  Save, Sparkles, Layers, ArrowLeft, ArrowUpRight, ShieldCheck,
  Eye, ToggleLeft, ToggleRight, FileText, Code2, AlertTriangle, Lightbulb
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';

const AdminGuidesManagementPage = () => {
  const [guides, setGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State
  const [formSlug, setFormSlug] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formDescription, setFormDescription] = useState('');
  const [formEstimatedTime, setFormEstimatedTime] = useState('10 mins');
  const [formStatus, setFormStatus] = useState('PUBLISHED');
  const [formIcon, setFormIcon] = useState('BookOpen');

  // New Section State
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  // New Step State
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [newStepTitle, setNewStepTitle] = useState('');
  const [newStepType, setNewStepType] = useState('text');
  const [newStepContent, setNewStepContent] = useState('');
  const [newStepCode, setNewStepCode] = useState('');
  const [addingStep, setAddingStep] = useState(false);

  useEffect(() => {
    fetchAdminGuides();
  }, []);

  const fetchAdminGuides = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    try {
      const res = await axios.get(`${API_URL}/api/guides/`, { headers });
      setGuides(Array.isArray(res.data) ? res.data : (res.data.results || []));
    } catch (err) {
      console.error('Error fetching admin guides:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGuide = async (slug) => {
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    try {
      const res = await axios.get(`${API_URL}/api/guides/${slug}/`, { headers });
      setSelectedGuide(res.data);
      setFormSlug(res.data.slug);
      setFormTitle(res.data.title);
      setFormCategory(res.data.category);
      setFormDescription(res.data.description || '');
      setFormEstimatedTime(res.data.estimated_time || '10 mins');
      setFormStatus(res.data.status || 'PUBLISHED');
      setFormIcon(res.data.icon || 'BookOpen');
      setIsEditing(true);
    } catch (err) {
      console.error('Error fetching guide details:', err);
    }
  };

  const handleCreateNewGuide = () => {
    setSelectedGuide(null);
    setFormSlug('');
    setFormTitle('');
    setFormCategory('General');
    setFormDescription('');
    setFormEstimatedTime('10 mins');
    setFormStatus('PUBLISHED');
    setFormIcon('BookOpen');
    setIsEditing(true);
  };

  const handleSaveGuide = async (e) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    const payload = {
      slug: formSlug,
      title: formTitle,
      category: formCategory,
      description: formDescription,
      estimated_time: formEstimatedTime,
      status: formStatus,
      icon: formIcon,
    };

    try {
      if (selectedGuide) {
        await axios.put(`${API_URL}/api/guides/${selectedGuide.slug}/`, payload, { headers });
      } else {
        await axios.post(`${API_URL}/api/guides/`, payload, { headers });
      }
      await fetchAdminGuides();
      setIsEditing(false);
      setSelectedGuide(null);
    } catch (err) {
      console.error('Error saving guide:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteGuide = async (slug) => {
    if (!window.confirm('Are you sure you want to delete this guide?')) return;
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    try {
      await axios.delete(`${API_URL}/api/guides/${slug}/`, { headers });
      await fetchAdminGuides();
      setIsEditing(false);
      setSelectedGuide(null);
    } catch (err) {
      console.error('Error deleting guide:', err);
    }
  };

  const handleAddSection = async () => {
    if (!newSectionTitle.trim() || !selectedGuide) return;
    setAddingSection(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    try {
      await axios.post(`${API_URL}/api/guides/${selectedGuide.slug}/add_section/`, {
        title: newSectionTitle
      }, { headers });
      setNewSectionTitle('');
      await handleSelectGuide(selectedGuide.slug);
    } catch (err) {
      console.error('Error adding section:', err);
    } finally {
      setAddingSection(false);
    }
  };

  const handleAddStep = async (sectionId) => {
    if (!selectedGuide) return;
    setAddingStep(true);
    const token = localStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    try {
      await axios.post(`${API_URL}/api/guides/${selectedGuide.slug}/add_step/`, {
        section_id: sectionId,
        title: newStepTitle,
        step_type: newStepType,
        content: newStepContent,
        code_snippet: newStepCode,
      }, { headers });

      setNewStepTitle('');
      setNewStepContent('');
      setNewStepCode('');
      setActiveSectionId(null);
      await handleSelectGuide(selectedGuide.slug);
    } catch (err) {
      console.error('Error adding step:', err);
    } finally {
      setAddingStep(false);
    }
  };

  return (
    <DashboardLayout role="ADMIN">
      <div className="w-full max-w-full pb-20 px-4 sm:px-8 lg:px-10 font-sans">
        
        {/* Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <BookOpen className="text-emerald-600" size={28} /> Interactive Guide Admin Center
            </h1>
            <p className="text-slate-500 font-medium text-xs mt-1">
              Create, edit, reorder, and manage step-by-step documentation guides for all UWOConnect client modules.
            </p>
          </div>

          <button
            onClick={handleCreateNewGuide}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-xs uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <Plus size={16} /> Create New Guide
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: GUIDES LIST ────────────────────────────────────────── */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-4 shadow-xs">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
              All Platform Guides ({guides.length})
            </h3>

            <div className="space-y-2">
              {guides.map(guide => (
                <div
                  key={guide.slug}
                  onClick={() => handleSelectGuide(guide.slug)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    selectedGuide?.slug === guide.slug
                      ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100/80 border-slate-200/80 text-slate-800'
                  }`}
                >
                  <div>
                    <h4 className="text-xs font-bold leading-snug">{guide.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] uppercase font-semibold text-emerald-400">{guide.category}</span>
                      <span>•</span>
                      <span className="text-[10px] font-medium opacity-75">{guide.total_sections || 0} Chapters</span>
                    </div>
                  </div>

                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md border uppercase ${
                    guide.status === 'PUBLISHED'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {guide.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT: GUIDE EDITOR ──────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-6">
            {isEditing ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <h3 className="text-base font-black text-slate-900">
                    {selectedGuide ? `Edit Guide: ${selectedGuide.title}` : 'Create New Learning Guide'}
                  </h3>
                  {selectedGuide && (
                    <button
                      onClick={() => handleDeleteGuide(selectedGuide.slug)}
                      className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  )}
                </div>

                {/* Main Details Form */}
                <form onSubmit={handleSaveGuide} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Guide Slug (URL Key)</label>
                      <input
                        type="text"
                        value={formSlug}
                        onChange={(e) => setFormSlug(e.target.value)}
                        placeholder="connectors"
                        required
                        disabled={!!selectedGuide}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Guide Title</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="Connectors & Integrations Master Guide"
                        required
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Category</label>
                      <input
                        type="text"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        placeholder="Integrations"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Estimated Time</label>
                      <input
                        type="text"
                        value={formEstimatedTime}
                        onChange={(e) => setFormEstimatedTime(e.target.value)}
                        placeholder="15 mins"
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-600 block mb-1">Publish Status</label>
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value)}
                        className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      >
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="DRAFT">DRAFT</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-600 block mb-1">Description Overview</label>
                    <textarea
                      rows={2}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Comprehensive overview of what users learn in this guide..."
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save size={15} /> {saving ? 'Saving...' : 'Save Guide Details'}
                  </button>
                </form>

                {/* Sections & Steps Builder (Only for existing guide) */}
                {selectedGuide && (
                  <div className="pt-6 border-t border-slate-100 space-y-6">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest flex items-center justify-between">
                      <span>Guide Chapters & Steps</span>
                    </h4>

                    {/* Add New Section */}
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="New Chapter Title (e.g. Meta Business Verification)"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-emerald-500"
                      />
                      <button
                        onClick={handleAddSection}
                        disabled={addingSection || !newSectionTitle.trim()}
                        className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all cursor-pointer"
                      >
                        + Add Chapter
                      </button>
                    </div>

                    {/* Chapter Accordion List */}
                    <div className="space-y-4">
                      {selectedGuide.sections?.map((sec, idx) => (
                        <div key={sec.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                          <div className="flex items-center justify-between font-bold text-xs text-slate-800">
                            <span>Chapter {idx + 1}: {sec.title}</span>
                            <button
                              onClick={() => setActiveSectionId(activeSectionId === sec.id ? null : sec.id)}
                              className="text-emerald-700 hover:underline cursor-pointer"
                            >
                              {activeSectionId === sec.id ? 'Cancel' : '+ Add Topic Step'}
                            </button>
                          </div>

                          {/* Steps List */}
                          <div className="space-y-2 pl-3 border-l-2 border-slate-200">
                            {sec.steps?.map((step, stIdx) => (
                              <div key={step.id || stIdx} className="p-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 flex items-center justify-between">
                                <div>
                                  <span className="font-bold text-slate-900">{step.title || `Step ${stIdx + 1}`}</span>
                                  <span className="text-[10px] font-semibold text-slate-400 uppercase ml-2 px-1.5 py-0.5 bg-slate-100 rounded">
                                    {step.step_type}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Add Step Form inside Section */}
                          {activeSectionId === sec.id && (
                            <div className="p-3 bg-white border border-emerald-200 rounded-xl space-y-3 mt-2">
                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  placeholder="Topic Title"
                                  value={newStepTitle}
                                  onChange={(e) => setNewStepTitle(e.target.value)}
                                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                />
                                <select
                                  value={newStepType}
                                  onChange={(e) => setNewStepType(e.target.value)}
                                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                                >
                                  <option value="text">Rich Text</option>
                                  <option value="code">Code Snippet</option>
                                  <option value="tip">Pro Tip Alert</option>
                                  <option value="warning">Warning Alert</option>
                                  <option value="diagram">Flow Diagram</option>
                                  <option value="checklist">Checklist</option>
                                </select>
                              </div>
                              <textarea
                                rows={2}
                                placeholder="Topic Content / Description..."
                                value={newStepContent}
                                onChange={(e) => setNewStepContent(e.target.value)}
                                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                              />
                              {newStepType === 'code' && (
                                <textarea
                                  rows={2}
                                  placeholder="Code snippet string..."
                                  value={newStepCode}
                                  onChange={(e) => setNewStepCode(e.target.value)}
                                  className="w-full px-3 py-1.5 bg-slate-900 text-emerald-400 font-mono rounded-lg text-xs"
                                />
                              )}
                              <button
                                onClick={() => handleAddStep(sec.id)}
                                disabled={addingStep}
                                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs"
                              >
                                Save Topic Step
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-400 space-y-3 shadow-xs">
                <BookOpen size={40} className="mx-auto text-slate-300" />
                <h3 className="text-sm font-bold text-slate-800">Select a Guide to Edit</h3>
                <p className="text-xs text-slate-400">Choose any guide from the left list or click "Create New Guide".</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminGuidesManagementPage;

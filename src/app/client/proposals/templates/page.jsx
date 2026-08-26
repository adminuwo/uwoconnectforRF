'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, Search, Plus, Trash2, Save, ArrowLeft, Loader2, Sparkles, 
  Trash, Edit3, X, Check, HelpCircle
} from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';

const ProposalTemplatesPage = () => {
  const router = useRouter();
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Edit/New Template Modal States
  const [activeModal, setActiveModal] = useState(null); // 'new' | 'edit'
  const [modalTemplate, setModalTemplate] = useState(null);

  // Template Form Inputs
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [sections, setSections] = useState([
    { title: 'Project Context', content: 'Outline the client objectives here.' },
    { title: 'SOW Deliverables', content: 'Detail the services scope and outputs.' }
  ]);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      const res = await axios.get(`${API_URL}/api/sales-document-templates/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTemplates(Array.isArray(res.data) ? res.data : res.data.results || []);
    } catch (err) {
      console.error("Error loading templates list", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenNewModal = () => {
    setName('');
    setDescription('');
    setSections([
      { title: 'Project Context', content: 'Outline the client objectives here.' },
      { title: 'SOW Deliverables', content: 'Detail the services scope and outputs.' }
    ]);
    setModalTemplate(null);
    setActiveModal('new');
  };

  const handleOpenEditModal = (tpl) => {
    setModalTemplate(tpl);
    setName(tpl.name);
    setDescription(tpl.description || '');
    setSections(tpl.sections || []);
    setActiveModal('edit');
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      { title: 'New Scope Section', content: 'Provide scope parameters here.' }
    ]);
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, idx) => idx !== index));
  };

  const handleSectionChange = (index, field, value) => {
    const copy = [...sections];
    copy[index][field] = value;
    setSections(copy);
  };

  const handleSaveTemplate = async () => {
    if (!name) {
      alert("Template Name is required.");
      return;
    }

    setSaving(true);
    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';

    const payload = {
      name,
      document_type: 'PROPOSAL',
      description,
      sections
    };

    try {
      if (activeModal === 'new') {
        await axios.post(`${API_URL}/api/sales-document-templates/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`${API_URL}/api/sales-document-templates/${modalTemplate.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      alert("Template saved successfully!");
      setActiveModal(null);
      fetchTemplates();
    } catch (err) {
      alert("Failed to save: " + (err.response?.data?.error || err.message));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTemplate = async (tplId) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    const token = localStorage.getItem('token');
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    try {
      await axios.delete(`${API_URL}/api/sales-document-templates/${tplId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchTemplates();
    } catch (err) {
      alert("Failed to delete template: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-7xl mx-auto w-full p-3 sm:p-6 pb-20 space-y-4 sm:space-y-6">
        
        {/* Title bar */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 hover:text-slate-900 border border-slate-200 bg-white cursor-pointer"
          >
            <ArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-lg font-black text-slate-900 tracking-tight">Proposal Templates</h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Configure reusable SOW and RFP formats</p>
          </div>
        </div>

        {/* Templates List */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          
          {/* Create new Card button */}
          <div
            onClick={handleOpenNewModal}
            className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer transition-all hover:bg-emerald-50/10 min-h-48 flex flex-col items-center justify-center space-y-2 group"
          >
            <div className="w-10 h-10 bg-slate-50 group-hover:bg-emerald-50 rounded-xl flex items-center justify-center text-slate-500 group-hover:text-emerald-600 transition-colors">
              <Plus size={20} />
            </div>
            <h3 className="text-xs font-bold text-slate-800">Add New Template</h3>
            <p className="text-[10px] text-slate-400 max-w-[200px] mx-auto">Create a reusable proposal layout to save time writing drafts.</p>
          </div>

          {/* Load templates cards list */}
          {loading ? (
            <div className="md:col-span-2 p-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
              <Loader2 className="animate-spin text-emerald-600" size={20} />
              <span className="text-xs font-semibold">Loading templates...</span>
            </div>
          ) : templates.length === 0 ? (
            <div className="md:col-span-2 p-12 text-center text-slate-400 font-bold">
              No proposal templates currently created. Add a template to start.
            </div>
          ) : (
            templates.map((tpl) => (
              <div key={tpl.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-48 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-slate-400" />
                    <h3 className="text-xs font-black text-slate-800">{tpl.name}</h3>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed font-medium line-clamp-3">
                    {tpl.description || 'No description provided.'}
                  </p>
                  <span className="inline-block text-[9px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">
                    {tpl.sections?.length || 0} Sections
                  </span>
                </div>
                
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-50">
                  <button
                    onClick={() => handleOpenEditModal(tpl)}
                    className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-900 cursor-pointer"
                    title="Edit Template"
                  >
                    <Edit3 size={13} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(tpl.id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 cursor-pointer"
                    title="Delete Template"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}

        </div>

        {/* Modal builder popup for Creating or Editing templates */}
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-2xl shadow-2xl relative space-y-5 my-8">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-black text-slate-900 text-sm">
                  {activeModal === 'new' ? 'Create Proposal Template' : 'Edit Template'}
                </h3>
                <button onClick={() => setActiveModal(null)} className="p-1 hover:bg-slate-100 rounded-lg text-slate-400 cursor-pointer">
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Template Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Standard Software SOW"
                    className="w-full p-2.5 bg-slate-50 text-slate-800 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Short summary of target deal or use cases..."
                    className="w-full p-2.5 bg-slate-50 text-slate-850 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                  />
                </div>

                {/* Scope Sections builder */}
                <div className="space-y-3.5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Template Sections</span>
                  </div>
                  
                  {sections.map((sec, idx) => (
                    <div key={idx} className="p-4 border border-slate-100 bg-slate-50/30 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={sec.title}
                          onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                          placeholder="Section Title (e.g. Problem Statement)"
                          className="font-bold text-xs text-slate-850 bg-white p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 w-2/3"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveSection(idx)}
                          className="text-slate-400 hover:text-red-500 p-1 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                      <textarea
                        rows={3}
                        value={sec.content}
                        onChange={(e) => handleSectionChange(idx, 'content', e.target.value)}
                        placeholder="Content layout parameters..."
                        className="w-full p-2 bg-white text-slate-700 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={handleAddSection}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-dashed border-slate-200 text-slate-650 hover:text-slate-905 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={13} />
                    <span>Add Custom Section Block</span>
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2.5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={saving}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {saving && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Template Layout</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default ProposalTemplatesPage;

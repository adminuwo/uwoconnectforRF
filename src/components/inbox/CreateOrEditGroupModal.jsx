'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, Loader2, Users, Star, Tag, Briefcase, Heart, 
  AlertCircle, DollarSign, Shield, Zap, Sparkles, ChevronDown, ChevronUp, Trash2,
  Search, Phone, Check, MessageSquare
} from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

const PRESET_COLORS = [
  { label: 'Emerald', hex: '#10B981' },
  { label: 'Blue', hex: '#3B82F6' },
  { label: 'Purple', hex: '#8B5CF6' },
  { label: 'Pink', hex: '#EC4899' },
  { label: 'Amber', hex: '#F59E0B' },
  { label: 'Rose', hex: '#F43F5E' },
  { label: 'Cyan', hex: '#06B6D4' },
  { label: 'Indigo', hex: '#6366F1' },
];

const PRESET_ICONS = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'star', label: 'Star', icon: Star },
  { id: 'tag', label: 'Tag', icon: Tag },
  { id: 'briefcase', label: 'Business', icon: Briefcase },
  { id: 'heart', label: 'VIP/Heart', icon: Heart },
  { id: 'dollar-sign', label: 'Payment', icon: DollarSign },
  { id: 'alert-circle', label: 'Priority', icon: AlertCircle },
  { id: 'shield', label: 'Support', icon: Shield },
  { id: 'zap', label: 'Urgent', icon: Zap },
];

const PLATFORMS = [
  { id: 'ALL', label: 'All Platforms' },
  { id: 'WHATSAPP', label: 'WhatsApp' },
  { id: 'INSTAGRAM', label: 'Instagram' },
  { id: 'FACEBOOK', label: 'Facebook Messenger' },
  { id: 'GMAIL', label: 'Email / Gmail' },
];

export default function CreateOrEditGroupModal({
  isOpen,
  onClose,
  groupToEdit = null,
  defaultChannel = 'ALL',
  onGroupSaved,
  onGroupDeleted,
  getAuthToken,
  conversations = []
}) {
  const { isDark } = useTheme();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10B981');
  const [icon, setIcon] = useState('users');
  const [channel, setChannel] = useState('ALL');
  
  // Numbers / Conversation Selection
  const [availableConvos, setAvailableConvos] = useState([]);
  const [loadingConvos, setLoadingConvos] = useState(false);
  const [selectedConvoIds, setSelectedConvoIds] = useState([]);
  const [numberSearch, setNumberSearch] = useState('');

  // Auto-assignment rules
  const [showAutoRules, setShowAutoRules] = useState(false);
  const [autoKeywords, setAutoKeywords] = useState('');
  const [autoAssignVip, setAutoAssignVip] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (groupToEdit) {
        setName(groupToEdit.name || '');
        setDescription(groupToEdit.description || '');
        setColor(groupToEdit.color || '#10B981');
        setIcon(groupToEdit.icon || 'users');
        setChannel(groupToEdit.channel || 'ALL');
        const kws = groupToEdit.auto_assignment_keywords || [];
        setAutoKeywords(Array.isArray(kws) ? kws.join(', ') : String(kws || ''));
        setAutoAssignVip(Boolean(groupToEdit.auto_assign_vip));
        if (kws.length > 0 || groupToEdit.auto_assign_vip) {
          setShowAutoRules(true);
        }
      } else {
        setName('');
        setDescription('');
        setColor('#10B981');
        setIcon('users');
        setChannel(defaultChannel && defaultChannel !== 'ALL' ? defaultChannel.toUpperCase() : 'ALL');
        setAutoKeywords('');
        setAutoAssignVip(false);
        setShowAutoRules(false);
      }
      setError('');
      setNumberSearch('');

      // Fetch or sync available numbers / conversations
      const fetchAvailableNumbers = async () => {
        try {
          setLoadingConvos(true);
          const token = getAuthToken();
          if (!token) return;
          const res = await axios.get(`${API_BASE_URL}/api/conversations/?limit=200`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const raw = Array.isArray(res.data) ? res.data : (res.data?.results || []);
          const list = raw.map(c => {
            const rawAddr = c.contact_platform_id || c.contact_phone || c.id;
            return {
              id: String(c.id || rawAddr),
              convoDbId: c.id ? String(c.id) : null,
              name: c.contact_name || c.contact?.name || 'Customer',
              phone: c.contact_phone || c.contact?.phone_number || rawAddr,
              rawAddress: rawAddr,
              channel: (c.channel || 'WHATSAPP').toUpperCase(),
              lastMessage: c.last_message_summary || '',
              custom_group_ids: Array.isArray(c.custom_group_ids) ? c.custom_group_ids.map(String) : [],
              custom_groups: Array.isArray(c.custom_groups) ? c.custom_groups : []
            };
          });

          // Also merge with any passed in conversations
          if (conversations && conversations.length > 0) {
            const seen = new Set(list.map(c => c.id));
            for (const c of conversations) {
              const cid = String(c.id || c.convoDbId || c.rawAddress);
              if (!seen.has(cid)) {
                seen.add(cid);
                list.push({
                  id: cid,
                  convoDbId: c.convoDbId ? String(c.convoDbId) : cid,
                  name: c.name || 'Customer',
                  phone: c.rawAddress || cid,
                  rawAddress: c.rawAddress || cid,
                  channel: (c.channel || 'WHATSAPP').toUpperCase(),
                  lastMessage: c.lastMessage || '',
                  custom_group_ids: Array.isArray(c.custom_group_ids) ? c.custom_group_ids.map(String) : [],
                  custom_groups: Array.isArray(c.custom_groups) ? c.custom_groups : []
                });
              }
            }
          }

          setAvailableConvos(list);

          // If editing group, pre-select conversations belonging to this group
          if (groupToEdit && groupToEdit.id) {
            const gid = String(groupToEdit.id);
            const initialSelected = list
              .filter(c => {
                const inIds = Array.isArray(c.custom_group_ids) && c.custom_group_ids.some(x => String(x) === gid);
                const inObjs = Array.isArray(c.custom_groups) && c.custom_groups.some(g => String(g.id || g) === gid);
                return inIds || inObjs;
              })
              .map(c => c.id);
            setSelectedConvoIds(initialSelected);
          } else {
            setSelectedConvoIds([]);
          }
        } catch (err) {
          console.warn('Failed to load numbers for group modal:', err);
          if (conversations && conversations.length > 0) {
            const fallback = conversations.map(c => ({
              id: String(c.id || c.convoDbId || c.rawAddress),
              convoDbId: c.convoDbId ? String(c.convoDbId) : null,
              name: c.name || 'Customer',
              phone: c.rawAddress || String(c.id),
              rawAddress: c.rawAddress || String(c.id),
              channel: (c.channel || 'WHATSAPP').toUpperCase(),
              lastMessage: c.lastMessage || '',
              custom_group_ids: Array.isArray(c.custom_group_ids) ? c.custom_group_ids.map(String) : [],
              custom_groups: Array.isArray(c.custom_groups) ? c.custom_groups : []
            }));
            setAvailableConvos(fallback);
            if (groupToEdit && groupToEdit.id) {
              const gid = String(groupToEdit.id);
              setSelectedConvoIds(fallback.filter(c => {
                const inIds = Array.isArray(c.custom_group_ids) && c.custom_group_ids.some(x => String(x) === gid);
                const inObjs = Array.isArray(c.custom_groups) && c.custom_groups.some(g => String(g.id || g) === gid);
                return inIds || inObjs;
              }).map(c => c.id));
            }
          }
        } finally {
          setLoadingConvos(false);
        }
      };

      fetchAvailableNumbers();
    }
  }, [isOpen, groupToEdit]);

  // Filter conversations by channel and search text
  const filteredConvos = useMemo(() => {
    let list = availableConvos;
    if (channel && channel !== 'ALL') {
      list = list.filter(c => (c.channel || '').toUpperCase() === channel.toUpperCase());
    }
    if (numberSearch.trim()) {
      const q = numberSearch.trim().toLowerCase();
      list = list.filter(c => 
        (c.name || '').toLowerCase().includes(q) ||
        (c.phone || '').toLowerCase().includes(q) ||
        (c.rawAddress || '').toLowerCase().includes(q) ||
        (c.lastMessage || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [availableConvos, channel, numberSearch]);

  const toggleConvoSelection = (id) => {
    const idStr = String(id);
    setSelectedConvoIds(prev => 
      prev.includes(idStr) ? prev.filter(x => x !== idStr) : [...prev, idStr]
    );
  };

  const handleSelectAllFiltered = () => {
    const allFilteredIds = filteredConvos.map(c => String(c.id));
    setSelectedConvoIds(prev => Array.from(new Set([...prev, ...allFilteredIds])));
  };

  const handleClearSelection = () => {
    setSelectedConvoIds([]);
  };

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a group name');
      return;
    }

    try {
      setIsSaving(true);
      setError('');
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;

      const keywordsList = autoKeywords
        .split(',')
        .map(k => k.trim())
        .filter(Boolean);

      const payload = {
        name: name.trim(),
        description: description.trim(),
        color,
        icon,
        channel,
        auto_assignment_keywords: keywordsList,
        auto_assign_vip: autoAssignVip,
      };

      let res;
      if (groupToEdit && groupToEdit.id) {
        res = await axios.patch(`${apiUrl}/api/chat-groups/${groupToEdit.id}/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        res = await axios.post(`${apiUrl}/api/chat-groups/`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      const savedGroup = res.data;
      const groupId = savedGroup?.id;

      // Bulk assign selected numbers / conversations to this group
      if (groupId) {
        try {
          await axios.post(
            `${apiUrl}/api/chat-groups/${groupId}/set_conversations/`,
            { conversation_ids: selectedConvoIds },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (setErr) {
          console.error('Error assigning conversations to group:', setErr);
        }
      }

      if (onGroupSaved) onGroupSaved(savedGroup, selectedConvoIds);
      onClose();
    } catch (err) {
      console.error('Failed to save group:', err);
      const data = err?.response?.data;
      const msg = (typeof data === 'string' ? data : null) ||
        data?.error ||
        (Array.isArray(data?.name) ? data.name[0] : null) ||
        data?.detail ||
        data?.message ||
        'Failed to save group. Please try again.';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!groupToEdit || !groupToEdit.id) return;
    if (!window.confirm(`Are you sure you want to delete the group "${groupToEdit.name}"? Conversations in this group will not be deleted.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;
      await axios.delete(`${apiUrl}/api/chat-groups/${groupToEdit.id}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (onGroupDeleted) onGroupDeleted(groupToEdit.id);
      onClose();
    } catch (err) {
      console.error('Failed to delete group:', err);
      alert('Failed to delete group. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={cn(
          "w-full max-w-lg rounded-2xl shadow-2xl border flex flex-col max-h-[92vh] overflow-hidden transition-all duration-200",
          isDark ? "bg-[#0f172a] border-slate-800 text-white" : "bg-white border-slate-200 text-slate-900"
        )}
      >
        {/* Header */}
        <div className={cn(
          "flex items-center justify-between p-4 sm:p-5 border-b",
          isDark ? "border-slate-800" : "border-slate-200"
        )}>
          <div className="flex items-center gap-2.5">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: color }}
            >
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-extrabold tracking-tight">
                {groupToEdit ? 'Edit Custom Chat Group' : 'Create Custom Chat Group'}
              </h2>
              <p className={cn("text-[11px]", isDark ? "text-slate-400" : "text-slate-500")}>
                Organize your WhatsApp, Facebook & Instagram numbers & chats
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-xl transition-colors cursor-pointer",
              isDark ? "hover:bg-slate-800 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-500 hover:text-slate-900"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 scrollbar-thin">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Group Name */}
          <div className="space-y-1">
            <label className="text-xs font-bold block">
              Group Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. VIP Customers, New Leads, Follow Up"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cn(
                "w-full px-3.5 py-2.5 rounded-xl text-xs outline-none border transition-colors",
                isDark 
                  ? "bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" 
                  : "bg-slate-100 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
              )}
              required
            />
          </div>

          {/* Platform Association */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold block">Platform Association</label>
            <div className="grid grid-cols-2 gap-1.5">
              {PLATFORMS.map(p => {
                const isSelected = channel === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setChannel(p.id)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all text-left truncate cursor-pointer",
                      isSelected
                        ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                        : isDark
                          ? "bg-slate-800/70 text-slate-300 border-slate-700 hover:bg-slate-800"
                          : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/70"
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Color & Icon Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Color Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block">Group Color</label>
              <div className="flex items-center gap-1.5 flex-wrap">
                {PRESET_COLORS.map(c => {
                  const isSelected = color.toLowerCase() === c.hex.toLowerCase();
                  return (
                    <button
                      key={c.hex}
                      type="button"
                      onClick={() => setColor(c.hex)}
                      style={{ backgroundColor: c.hex }}
                      className={cn(
                        "w-6 h-6 rounded-full transition-transform cursor-pointer flex items-center justify-center shadow-xs",
                        isSelected ? "scale-125 ring-2 ring-offset-2 ring-emerald-500 ring-offset-slate-900" : "hover:scale-110"
                      )}
                      title={c.label}
                    />
                  );
                })}
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold block">Group Icon</label>
              <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                {PRESET_ICONS.map(i => {
                  const IconComponent = i.icon;
                  const isSelected = icon === i.id;
                  return (
                    <button
                      key={i.id}
                      type="button"
                      onClick={() => setIcon(i.id)}
                      className={cn(
                        "p-1.5 rounded-xl border transition-all cursor-pointer shrink-0",
                        isSelected
                          ? "bg-emerald-600 text-white border-emerald-500 shadow-xs"
                          : isDark
                            ? "bg-slate-800/70 text-slate-400 border-slate-700 hover:text-white"
                            : "bg-slate-100 text-slate-500 border-slate-200 hover:text-slate-900"
                      )}
                      title={i.label}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ------------------------------------------------------------- */}
          {/* SELECT NUMBERS / CONVERSATIONS TO ADD                          */}
          {/* ------------------------------------------------------------- */}
          <div className={cn(
            "rounded-xl border p-3 space-y-2.5 transition-colors",
            isDark ? "border-slate-800 bg-slate-900/60" : "border-slate-200 bg-slate-50/70"
          )}>
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                <span>Select Numbers / Conversations</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/20">
                  {selectedConvoIds.length} selected
                </span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={handleSelectAllFiltered}
                  className="text-emerald-500 hover:underline font-bold cursor-pointer"
                >
                  Select All
                </button>
                <span className="text-slate-400">•</span>
                <button
                  type="button"
                  onClick={handleClearSelection}
                  className="text-slate-400 hover:text-slate-200 hover:underline cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Search Input for Numbers */}
            <div className="relative">
              <Search className={cn("w-3.5 h-3.5 absolute left-3 top-2.5", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Search number, contact name, or PSID..."
                value={numberSearch}
                onChange={(e) => setNumberSearch(e.target.value)}
                className={cn(
                  "w-full rounded-xl pl-8 pr-3 py-1.5 text-xs outline-none border transition-colors",
                  isDark 
                    ? "bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-emerald-500" 
                    : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-emerald-500"
                )}
              />
            </div>

            {/* List of Numbers */}
            <div className={cn(
              "max-h-48 overflow-y-auto rounded-xl border divide-y transition-colors scrollbar-thin",
              isDark ? "bg-[#090d16] border-slate-800 divide-slate-800" : "bg-white border-slate-200 divide-slate-100"
            )}>
              {loadingConvos ? (
                <div className="p-5 text-center text-xs flex items-center justify-center gap-2 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span>Loading numbers & chats...</span>
                </div>
              ) : filteredConvos.length === 0 ? (
                <div className="p-5 text-center text-xs text-slate-400">
                  No numbers or conversations found {numberSearch ? `matching "${numberSearch}"` : ''}.
                </div>
              ) : (
                filteredConvos.map(c => {
                  const isChecked = selectedConvoIds.includes(String(c.id));
                  const displayName = (!c.name || c.name.toLowerCase() === 'unknown') ? (c.rawAddress || 'Customer') : c.name;
                  const number = c.rawAddress || c.phone || c.id;

                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleConvoSelection(String(c.id))}
                      className={cn(
                        "flex items-center justify-between p-2.5 cursor-pointer transition-colors text-xs select-none",
                        isChecked
                          ? isDark ? "bg-emerald-950/40 text-white" : "bg-emerald-50 text-slate-900"
                          : isDark ? "hover:bg-slate-800/60 text-slate-300" : "hover:bg-slate-50 text-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
                        <div className={cn(
                          "w-4 h-4 rounded border flex items-center justify-center transition-colors shrink-0",
                          isChecked 
                            ? "bg-emerald-600 border-emerald-600 text-white" 
                            : isDark ? "border-slate-700 bg-slate-800" : "border-slate-300 bg-white"
                        )}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>

                        <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-[11px] shrink-0">
                          {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="font-bold truncate text-[11px] flex items-center gap-1.5">
                            <span className="truncate">{displayName}</span>
                            {displayName !== number && (
                              <span className="text-[10px] font-mono text-slate-400 font-normal truncate">
                                {number}
                              </span>
                            )}
                          </div>
                          {c.lastMessage && (
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {c.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-1">
                        <span className={cn(
                          "text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-2xs",
                          c.channel === 'FACEBOOK'
                            ? 'bg-blue-600 text-white'
                            : c.channel === 'INSTAGRAM'
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                            : 'bg-emerald-600 text-white'
                        )}>
                          {c.channel || 'WHATSAPP'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Optional Automatic Assignment Rules Accordion */}
          <div className={cn(
            "rounded-xl border p-3 transition-colors",
            isDark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50/60"
          )}>
            <button
              type="button"
              onClick={() => setShowAutoRules(!showAutoRules)}
              className="w-full flex items-center justify-between text-xs font-bold cursor-pointer"
            >
              <span className="flex items-center gap-1.5 text-emerald-500">
                <Sparkles className="w-3.5 h-3.5" />
                Automatic Assignment Rules (Optional)
              </span>
              {showAutoRules ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAutoRules && (
              <div className="mt-3 pt-3 border-t space-y-3 animate-in fade-in duration-150 border-slate-700/50">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold block">
                    Assign if message contains keywords:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. pricing, quotation, discount, quote"
                    value={autoKeywords}
                    onChange={(e) => setAutoKeywords(e.target.value)}
                    className={cn(
                      "w-full px-3 py-1.5 rounded-lg text-xs outline-none border transition-colors",
                      isDark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-200 text-slate-900"
                    )}
                  />
                  <p className={cn("text-[10px]", isDark ? "text-slate-500" : "text-slate-400")}>
                    Comma-separated. Case-insensitive matching on incoming customer messages.
                  </p>
                </div>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={autoAssignVip}
                    onChange={(e) => setAutoAssignVip(e.target.checked)}
                    className="rounded border-slate-700 text-emerald-600 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span className="text-xs font-medium">
                    Automatically assign contacts marked as <strong className="text-emerald-500">VIP</strong> in CRM
                  </span>
                </label>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2">
            {groupToEdit ? (
              <button
                type="button"
                disabled={isDeleting || isSaving}
                onClick={handleDelete}
                className="px-3 py-2 rounded-xl text-xs font-bold text-rose-500 hover:bg-rose-500/10 border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className={cn(
                  "px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer",
                  isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{groupToEdit ? 'Save Changes' : 'Create Group'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

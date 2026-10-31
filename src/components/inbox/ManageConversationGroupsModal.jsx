'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Check, Plus, Tag, Search } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/ThemeContext';

export default function ManageConversationGroupsModal({
  isOpen,
  onClose,
  conversation,
  allGroups = [],
  onGroupsUpdated,
  onOpenCreateGroup,
  getAuthToken
}) {
  const { isDark } = useTheme();
  const [selectedGroupIds, setSelectedGroupIds] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && conversation) {
      const gids = conversation.custom_group_ids || (conversation.custom_groups || []).map(g => g.id) || [];
      setSelectedGroupIds(gids.map(String));
      setError('');
      setSearch('');
    }
  }, [isOpen, conversation]);

  if (!isOpen || !conversation) return null;

  const toggleGroup = (groupId) => {
    const gid = String(groupId);
    setSelectedGroupIds(prev => 
      prev.includes(gid) ? prev.filter(id => id !== gid) : [...prev, gid]
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError('');
      const token = getAuthToken();
      const apiUrl = API_BASE_URL;

      const convoId = conversation.convoDbId || conversation.id;
      const res = await axios.post(
        `${apiUrl}/api/conversations/${convoId}/set_groups/`,
        { group_ids: selectedGroupIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (onGroupsUpdated) {
        onGroupsUpdated(conversation.id, selectedGroupIds, res.data?.conversation);
      }
      onClose();
    } catch (err) {
      console.error('Failed to update conversation groups:', err);
      setError('Failed to update conversation groups. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredGroups = allGroups.filter(g => 
    !search || g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className={cn(
          "w-full max-w-sm rounded-2xl border shadow-2xl overflow-hidden flex flex-col transition-all",
          isDark ? "bg-[#0f172a] border-slate-800 text-slate-100" : "bg-white border-slate-200 text-slate-900"
        )}
      >
        {/* Header */}
        <div className={cn(
          "p-4 border-b flex items-center justify-between",
          isDark ? "border-slate-800 bg-[#0f172a]" : "border-slate-100 bg-slate-50/70"
        )}>
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-500" />
            <div>
              <h3 className="text-xs font-bold">Assign Chat Groups</h3>
              <p className={cn("text-[10px]", isDark ? "text-slate-400" : "text-slate-500")}>
                {conversation.name || conversation.rawAddress || 'Conversation'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={cn(
              "p-1.5 rounded-lg transition-colors cursor-pointer",
              isDark ? "hover:bg-slate-800 text-slate-400" : "hover:bg-slate-200 text-slate-500"
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3">
          {error && (
            <div className="p-2 rounded-lg text-xs bg-rose-500/10 text-rose-500 border border-rose-500/20">
              {error}
            </div>
          )}

          {allGroups.length > 5 && (
            <div className="relative">
              <Search className={cn("w-3.5 h-3.5 absolute left-2.5 top-2.5", isDark ? "text-slate-500" : "text-slate-400")} />
              <input
                type="text"
                placeholder="Search groups..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={cn(
                  "w-full pl-8 pr-3 py-1.5 rounded-xl text-xs outline-none border transition-colors",
                  isDark ? "bg-slate-800/80 border-slate-700 text-white" : "bg-slate-100 border-slate-200 text-slate-900"
                )}
              />
            </div>
          )}

          <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
            {filteredGroups.length > 0 ? (
              filteredGroups.map(group => {
                const isChecked = selectedGroupIds.includes(String(group.id));
                return (
                  <div
                    key={group.id}
                    onClick={() => toggleGroup(group.id)}
                    className={cn(
                      "flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all",
                      isChecked 
                        ? isDark
                          ? "bg-emerald-950/40 border-emerald-600/50" 
                          : "bg-emerald-50 border-emerald-300"
                        : isDark
                          ? "bg-slate-800/40 border-slate-800 hover:bg-slate-800/80"
                          : "bg-slate-50 border-slate-200/70 hover:bg-slate-100"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div 
                        className="w-3.5 h-3.5 rounded-full shrink-0 shadow-2xs"
                        style={{ backgroundColor: group.color || '#10B981' }}
                      />
                      <div className="min-w-0">
                        <span className="text-xs font-bold block truncate">{group.name}</span>
                        {group.channel && group.channel !== 'ALL' && (
                          <span className={cn("text-[9px] font-semibold uppercase", isDark ? "text-slate-400" : "text-slate-500")}>
                            {group.channel}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className={cn(
                      "w-5 h-5 rounded-md border flex items-center justify-center transition-colors shrink-0",
                      isChecked 
                        ? "bg-emerald-600 border-emerald-600 text-white" 
                        : isDark ? "border-slate-700 bg-slate-900" : "border-slate-300 bg-white"
                    )}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-6">
                <p className={cn("text-xs", isDark ? "text-slate-400" : "text-slate-500")}>
                  {allGroups.length === 0 ? "No groups created yet." : "No groups match your search."}
                </p>
              </div>
            )}
          </div>

          {/* Quick Create Group Button */}
          <button
            type="button"
            onClick={() => {
              onClose();
              if (onOpenCreateGroup) onOpenCreateGroup();
            }}
            className={cn(
              "w-full py-2 px-3 rounded-xl border border-dashed text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer",
              isDark 
                ? "border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400" 
                : "border-slate-300 hover:border-emerald-500 text-slate-600 hover:text-emerald-700"
            )}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create New Chat Group</span>
          </button>
        </div>

        {/* Footer */}
        <div className={cn(
          "p-3 border-t flex items-center justify-end gap-2",
          isDark ? "border-slate-800 bg-[#0f172a]" : "border-slate-100 bg-slate-50/70"
        )}>
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer",
              isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-600"
            )}
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-4 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isSaving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Groups</span>
          </button>
        </div>
      </div>
    </div>
  );
}

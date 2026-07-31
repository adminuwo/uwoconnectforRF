import React from 'react';
import { X, Check, Loader2, AlertCircle, Facebook, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MetaSelectModal({ isOpen, onClose, platform, items, onSelect, loading, error }) {
  const [selectedId, setSelectedId] = React.useState(null);

  React.useEffect(() => {
    if (isOpen) {
      setSelectedId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const chosen = items.find(item => {
      if (platform === 'FACEBOOK') {
        return item.id === selectedId;
      } else {
        return item.instagram_business_account?.id === selectedId;
      }
    });
    if (chosen) {
      onSelect(chosen);
    }
  };

  const getInstagramItems = () => {
    return items.filter(item => item.instagram_business_account);
  };

  const activeItems = platform === 'FACEBOOK' ? items : getInstagramItems();

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              {platform === 'FACEBOOK' ? (
                <>
                  <Facebook size={18} className="text-blue-600" />
                  <span>Select Facebook Page</span>
                </>
              ) : (
                <>
                  <Instagram size={18} className="text-pink-600" />
                  <span>Select Instagram Account</span>
                </>
              )}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">
              Choose the business profile you want to link.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-white border border-slate-100 p-1.5 rounded-lg transition-all shadow-xs"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto max-h-[60vh] min-h-[200px] flex flex-col">
          {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-emerald-600 animate-spin" />
              <span className="text-xs text-slate-400 font-medium">Fetching profiles from Meta...</span>
            </div>
          ) : error ? (
            <div className="flex-1 flex flex-col items-center justify-center py-6 text-center text-red-600 gap-2">
              <AlertCircle size={32} className="text-red-500" />
              <p className="text-xs font-semibold">{error}</p>
            </div>
          ) : activeItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center text-slate-400 gap-2">
              <AlertCircle size={24} className="text-slate-300" />
              <p className="text-xs font-medium">
                {platform === 'FACEBOOK' 
                  ? "No Facebook pages found on your Meta account."
                  : "No Instagram Business Accounts linked to your Facebook pages."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 flex-1">
              {activeItems.map((item) => {
                const targetId = platform === 'FACEBOOK' ? item.id : item.instagram_business_account.id;
                const isSelected = selectedId === targetId;
                const displayName = platform === 'FACEBOOK' ? item.name : item.instagram_business_account.username || item.instagram_business_account.name;
                const subtitle = platform === 'FACEBOOK' ? `ID: ${item.id}` : `Linked Page: ${item.name}`;

                return (
                  <button
                    key={targetId}
                    onClick={() => setSelectedId(targetId)}
                    className={cn(
                      "w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer",
                      isSelected 
                        ? "border-emerald-500 bg-emerald-50/40 text-slate-900 shadow-xs" 
                        : "border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 text-slate-600"
                    )}
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-xs truncate">{displayName}</p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{subtitle}</p>
                    </div>
                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                        <Check size={12} strokeWidth={2.5} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/45 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 rounded-lg text-xs font-semibold transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedId || loading}
            className={cn(
              "px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            )}
          >
            Confirm & Connect
          </button>
        </div>
      </div>
    </div>
  );
}

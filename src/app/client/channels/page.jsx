'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  CheckCircle2, 
  Loader2, 
  Copy, 
  Check, 
  Settings, 
  RefreshCw,
  Plus
} from 'lucide-react';
import axios from 'axios';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import WhatsAppConfigModal from '@/components/channels/WhatsAppConfigModal';
import FacebookConfigModal from '@/components/channels/FacebookConfigModal';
import InstagramConfigModal from '@/components/channels/InstagramConfigModal';

const FacebookIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 22, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e) => {
    e.stopPropagation();
    if (!text || text === 'N/A') return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy"
      className="p-1 text-slate-300 hover:text-slate-600 rounded transition-colors cursor-pointer shrink-0"
    >
      {copied ? <Check size={12} className="text-emerald-600 stroke-[2.5]" /> : <Copy size={12} />}
    </button>
  );
};

const ClientChannelsPage = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFacebookConfigModalOpen, setIsFacebookConfigModalOpen] = useState(false);
  const [isInstagramConfigModalOpen, setIsInstagramConfigModalOpen] = useState(false);
  
  const [toast, setToast] = useState(null);

  const fetchClient = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user.client) return;
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/clients/${user.client}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data);
      if (isManualRefresh) {
        setToast({ msg: 'Channels updated', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (err) {
      console.error('Failed to fetch client', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  const handleWhatsAppSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'WhatsApp configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleFacebookSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Facebook configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const handleInstagramSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Instagram configured', type: 'success' });
    setTimeout(() => setToast(null), 3000);
  };

  const isWhatsAppConnected = !!client?.whatsapp_phone_number_id;
  const isFacebookConnected = !!client?.facebook_config?.page_id;
  const isInstagramConnected = !!client?.instagram_config?.instagram_business_id;

  const connectedCount = [isWhatsAppConnected, isFacebookConnected, isInstagramConnected].filter(Boolean).length;

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-5xl mx-auto pb-16 px-4 sm:px-6 relative font-['Times_New_Roman',_Georgia,_serif]">
        {/* Toast Alert */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-2.5 px-4 py-2.5 rounded-xl shadow-lg font-medium text-xs bg-slate-900 text-white animate-in fade-in duration-200">
            <CheckCircle2 size={15} className="text-emerald-400" />
            <span>{toast.msg}</span>
          </div>
        )}

        {/* Clean Header */}
        <div className="py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Channels</h1>
            <p className="text-slate-400 text-xs mt-0.5 font-normal">Connect your social messaging accounts to automate replies.</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">
              <strong className="text-slate-700">{connectedCount}</strong> of 3 connected
            </span>
            <button
              onClick={() => fetchClient(true)}
              disabled={refreshing}
              className="p-2 text-slate-400 hover:text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw size={14} className={cn(refreshing && "animate-spin text-emerald-600")} />
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 py-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-50/60 rounded-2xl border border-slate-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

            {/* --- WHATSAPP CARD --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[360px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100/80 shrink-0">
                      <MessageCircle size={22} strokeWidth={2} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">WhatsApp</h3>
                      <p className="text-[11px] text-slate-400">Cloud API</p>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0",
                    isWhatsAppConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isWhatsAppConnected ? "bg-emerald-500" : "bg-slate-300")} />
                    <span>{isWhatsAppConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Official WhatsApp Business Cloud API for automated messaging and customer support.
                </p>

                {/* Details */}
                {isWhatsAppConnected ? (
                  <div className="space-y-3 py-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Business Name</span>
                      <span className="font-medium text-slate-700 max-w-[140px] truncate">{client?.business_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Phone</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-700">{client?.phone_number || 'N/A'}</span>
                        <CopyButton text={client?.phone_number} />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">WABA ID</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-700 max-w-[120px] truncate">{client?.whatsapp_waba_id || 'N/A'}</span>
                        <CopyButton text={client?.whatsapp_waba_id} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No WhatsApp account connected.</p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                {isWhatsAppConnected ? (
                  <button 
                    onClick={() => setIsConfigModalOpen(true)}
                    className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-slate-200/60"
                  >
                    <Settings size={14} className="text-slate-400" />
                    <span>Configure</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      window.location.href = "https://business.facebook.com/messaging/whatsapp/onboard/?app_id=991147863536661&config_id=1048515390903125&extras=%7B%22version%22%3A%22v4%22%2C%22sessionInfoVersion%22%3A%223%22%2C%22featureType%22%3A%22whatsapp_business_app_onboarding%22%7D&redirect_uri=https%3A%2F%2Fuwoconnect.aisa24.com%2Fsettings";
                    }}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Plus size={14} />
                    <span>Connect</span>
                  </button>
                )}
              </div>
            </div>


            {/* --- FACEBOOK CARD --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[360px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/80 shrink-0">
                      <FacebookIcon size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">Facebook</h3>
                      <p className="text-[11px] text-slate-400">Messenger</p>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0",
                    isFacebookConnected ? "bg-blue-50 text-blue-700 border border-blue-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isFacebookConnected ? "bg-blue-500" : "bg-slate-300")} />
                    <span>{isFacebookConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Connect your Facebook Business Pages to automate Messenger customer interactions.
                </p>

                {/* Details */}
                {isFacebookConnected ? (
                  <div className="space-y-3 py-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Page Name</span>
                      <span className="font-medium text-slate-700 max-w-[140px] truncate">{client?.facebook_config?.page_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Page ID</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-700 max-w-[120px] truncate">{client?.facebook_config?.page_id || 'N/A'}</span>
                        <CopyButton text={client?.facebook_config?.page_id} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No Facebook Page connected.</p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsFacebookConfigModalOpen(true)}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                    isFacebookConnected
                      ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {isFacebookConnected ? <Settings size={14} className="text-slate-400" /> : <Plus size={14} />}
                  <span>{isFacebookConnected ? 'Configure' : 'Connect'}</span>
                </button>
              </div>
            </div>


            {/* --- INSTAGRAM CARD --- */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between hover:border-slate-300 transition-all shadow-xs min-h-[360px]">
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-2xl bg-pink-50 text-pink-600 flex items-center justify-center border border-pink-100/80 shrink-0">
                      <InstagramIcon size={22} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-base">Instagram</h3>
                      <p className="text-[11px] text-slate-400">Direct Message</p>
                    </div>
                  </div>

                  <div className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium shrink-0",
                    isInstagramConnected ? "bg-pink-50 text-pink-700 border border-pink-200/50" : "bg-slate-100 text-slate-400"
                  )}>
                    <span className={cn("w-1.5 h-1.5 rounded-full", isInstagramConnected ? "bg-pink-500" : "bg-slate-300")} />
                    <span>{isInstagramConnected ? 'Connected' : 'Offline'}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-5">
                  Automate replies for Instagram DMs, story mentions, and customer comments.
                </p>

                {/* Details */}
                {isInstagramConnected ? (
                  <div className="space-y-3 py-3 border-t border-slate-100 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Account Name</span>
                      <span className="font-medium text-slate-700 max-w-[140px] truncate">{client?.instagram_config?.page_name || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Instagram ID</span>
                      <div className="flex items-center gap-1">
                        <span className="font-medium text-slate-700 max-w-[120px] truncate">{client?.instagram_config?.instagram_business_id || 'N/A'}</span>
                        <CopyButton text={client?.instagram_config?.instagram_business_id} />
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 py-6 text-center">No Instagram account connected.</p>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => setIsInstagramConfigModalOpen(true)}
                  className={cn(
                    "w-full py-2.5 px-4 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer",
                    isInstagramConnected
                      ? "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60"
                      : "bg-pink-600 hover:bg-pink-700 text-white"
                  )}
                >
                  {isInstagramConnected ? <Settings size={14} className="text-slate-400" /> : <Plus size={14} />}
                  <span>{isInstagramConnected ? 'Configure' : 'Connect'}</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* WhatsApp Configuration Modal */}
        <WhatsAppConfigModal 
          isOpen={isConfigModalOpen}
          onClose={() => setIsConfigModalOpen(false)}
          client={client}
          onSaved={handleWhatsAppSaved}
        />

        {/* Facebook Configuration Modal */}
        <FacebookConfigModal 
          isOpen={isFacebookConfigModalOpen}
          onClose={() => setIsFacebookConfigModalOpen(false)}
          client={client}
          onSaved={handleFacebookSaved}
        />

        {/* Instagram Configuration Modal */}
        <InstagramConfigModal 
          isOpen={isInstagramConfigModalOpen}
          onClose={() => setIsInstagramConfigModalOpen(false)}
          client={client}
          onSaved={handleInstagramSaved}
        />
      </div>
    </DashboardLayout>
  );
};

export default ClientChannelsPage;

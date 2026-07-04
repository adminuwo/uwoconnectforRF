'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, Lock, CheckCircle, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { cn } from '@/lib/utils';
import WhatsAppConfigModal from '@/components/channels/WhatsAppConfigModal';
import FacebookConfigModal from '@/components/channels/FacebookConfigModal';
import InstagramConfigModal from '@/components/channels/InstagramConfigModal';

const FacebookIcon = ({ size = 24, strokeWidth = 2, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = ({ size = 24, strokeWidth = 2, className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const ClientChannelsPage = () => {
  const router = useRouter();
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFacebookConfigModalOpen, setIsFacebookConfigModalOpen] = useState(false);
  const [isInstagramConfigModalOpen, setIsInstagramConfigModalOpen] = useState(false);
  
  const [toast, setToast] = useState(null);

  const fetchClient = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/clients/${user.client}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClient(res.data);
    } catch (err) {
      console.error('Failed to fetch client');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
  }, []);

  const handleWhatsAppSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'WhatsApp Business configured successfully.', type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFacebookSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Facebook Messenger configured successfully.', type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  const handleInstagramSaved = (updatedClient) => {
    setClient(updatedClient);
    setToast({ msg: 'Instagram configured successfully.', type: 'success' });
    setTimeout(() => setToast(null), 4000);
  };

  const channels = [
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'green',
      active: true,
      connected: !!client?.whatsapp_phone_number_id,
      detail: client?.whatsapp_phone_number_id || 'Not configured',
      description: 'Send automatic replies on WhatsApp.'
    },
    {
      name: 'Facebook',
      icon: FacebookIcon,
      color: 'blue',
      active: true,
      connected: !!client?.facebook_config?.page_id,
      detail: client?.facebook_config?.page_id || 'Not configured',
      description: 'Connect your Facebook Page for auto replies.'
    },
    {
      name: 'Instagram',
      icon: InstagramIcon,
      color: 'pink',
      active: true,
      connected: !!client?.instagram_config?.instagram_business_id,
      detail: client?.instagram_config?.instagram_business_id || 'Not configured',
      description: 'Automate Instagram DMs and replies.'
    },
  ];

  const formatLastUpdated = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const lastUpdatedText = client?.settings?.last_updated 
    ? formatLastUpdated(client.settings.last_updated)
    : client?.updated_at
      ? formatLastUpdated(client.updated_at)
      : 'Never';

  return (
    <DashboardLayout role="CLIENT">
      <div className="max-w-4xl mx-auto pb-20 px-4 relative">
        {/* Success/Error Toast */}
        {toast && (
          <div className="fixed top-6 right-6 z-[120] flex items-center gap-3 px-5 py-4 rounded-xl shadow-xl font-bold text-xs bg-emerald-50 border border-emerald-100 text-emerald-800 animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 size={16} className="text-[#16A34A] stroke-[2.5]" />
            <span>{toast.msg}</span>
          </div>
        )}

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">My Channels</h1>
          <p className="text-slate-500 font-medium italic">Connected platforms and their status.</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#16A34A]" size={40} /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {channels.map((ch) => {
              // Connected WhatsApp Layout
              if (ch.name === 'WhatsApp' && ch.connected) {
                return (
                  <div key={ch.name} className="bg-white rounded-[16px] border border-slate-200/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 relative overflow-hidden group min-h-[380px]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center border border-emerald-100/50">
                            <MessageCircle size={24} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base tracking-tight">WhatsApp</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Cloud API</p>
                          </div>
                        </div>
                        
                        <div className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={10} className="stroke-[3]" />
                          Connected
                        </div>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Business Name</span>
                          <span className="font-bold text-slate-700 max-w-[130px] truncate">{client?.business_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Phone Number</span>
                          <span className="font-bold text-slate-700 max-w-[130px] truncate">{client?.phone_number || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">WABA ID</span>
                          <span className="font-bold text-slate-700 truncate max-w-[110px]" title={client?.whatsapp_waba_id}>{client?.whatsapp_waba_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Phone Number ID</span>
                          <span className="font-bold text-slate-700 truncate max-w-[110px]" title={client?.whatsapp_phone_number_id}>{client?.whatsapp_phone_number_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Last Updated</span>
                          <span className="font-bold text-slate-700">{lastUpdatedText}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button 
                        onClick={() => setIsConfigModalOpen(true)}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Edit Configuration
                      </button>
                    </div>
                  </div>
                );
              }

              // Connected Facebook Layout
              if (ch.name === 'Facebook' && ch.connected) {
                return (
                  <div key={ch.name} className="bg-white rounded-[16px] border border-slate-200/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 relative overflow-hidden group min-h-[380px]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100/50">
                            <FacebookIcon size={24} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base tracking-tight">Facebook</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Messenger</p>
                          </div>
                        </div>
                        
                        <div className="px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={10} className="stroke-[3]" />
                          Connected
                        </div>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Page Name</span>
                          <span className="font-bold text-slate-700 max-w-[130px] truncate">{client?.facebook_config?.page_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Page ID</span>
                          <span className="font-bold text-slate-700 truncate max-w-[110px]" title={client?.facebook_config?.page_id}>{client?.facebook_config?.page_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Last Updated</span>
                          <span className="font-bold text-slate-700">{formatLastUpdated(client?.facebook_config?.last_updated)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button 
                        onClick={() => setIsFacebookConfigModalOpen(true)}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Edit Configuration
                      </button>
                    </div>
                  </div>
                );
              }

              // Connected Instagram Layout
              if (ch.name === 'Instagram' && ch.connected) {
                return (
                  <div key={ch.name} className="bg-white rounded-[16px] border border-slate-200/80 p-8 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-slate-100 relative overflow-hidden group min-h-[380px]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-pink-50 text-pink-500 flex items-center justify-center border border-pink-100/50">
                            <InstagramIcon size={24} strokeWidth={2} />
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900 text-base tracking-tight">Instagram</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Direct Message</p>
                          </div>
                        </div>
                        
                        <div className="px-2.5 py-1 bg-pink-50 text-pink-700 border border-pink-100 rounded-full flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider">
                          <CheckCircle2 size={10} className="stroke-[3]" />
                          Connected
                        </div>
                      </div>

                      <div className="space-y-3.5 text-xs">
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Account Name</span>
                          <span className="font-bold text-slate-700 max-w-[130px] truncate">{client?.instagram_config?.page_name || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Instagram ID</span>
                          <span className="font-bold text-slate-700 truncate max-w-[110px]" title={client?.instagram_config?.instagram_business_id}>{client?.instagram_config?.instagram_business_id || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between pb-1.5 border-b border-slate-100">
                          <span className="text-slate-400 font-semibold">Last Updated</span>
                          <span className="font-bold text-slate-700">{formatLastUpdated(client?.instagram_config?.last_updated)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-8">
                      <button 
                        onClick={() => setIsInstagramConfigModalOpen(true)}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md hover:shadow-lg cursor-pointer"
                      >
                        Edit Configuration
                      </button>
                    </div>
                  </div>
                );
              }

              // Standard layout for standard/unconnected channels
              return (
                <div key={ch.name} className={cn(
                  "bg-white rounded-[16px] border p-8 flex flex-col items-center text-center transition-all duration-300 group relative overflow-hidden min-h-[380px] justify-between",
                  ch.active 
                    ? "border-slate-200/80 hover:shadow-xl hover:shadow-slate-100" 
                    : "border-slate-100 opacity-50 grayscale bg-slate-50/30"
                )}>
                  <div className="absolute top-6 right-6">
                    {ch.active && ch.connected ? (
                      <div className="w-2 h-2 rounded-full bg-[#16A34A] shadow-md shadow-emerald-200" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-slate-200" />
                    )}
                  </div>

                  <div className="flex flex-col items-center w-full">
                    <div className={cn(
                      "w-16 h-16 rounded-xl flex items-center justify-center mb-6 transition-all duration-700 shadow-sm border",
                      !ch.active 
                        ? "bg-slate-100 text-slate-300 border-slate-200/50" 
                        : ch.name === 'WhatsApp' ? "bg-emerald-50 text-[#16A34A] border-emerald-100/50" :
                          ch.name === 'Facebook' ? "bg-blue-50 text-blue-600 border-blue-100/50" :
                          "bg-pink-50 text-pink-500 border-pink-100/50"
                    )}>
                      <ch.icon size={28} strokeWidth={2} />
                    </div>

                    <div className="mb-6 flex-1 w-full px-2">
                      <div className="flex flex-col items-center gap-1.5 mb-3">
                        <h3 className="font-bold text-slate-900 text-lg tracking-tight">{ch.name}</h3>
                        {!ch.active && (
                          <span className="px-2 py-0.5 bg-slate-100 text-slate-400 text-[8px] font-bold uppercase tracking-wider rounded border border-slate-200/30">Locked</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">{ch.description}</p>
                    </div>
                  </div>

                  <div className="w-full flex justify-center mt-4">
                    {ch.active ? (
                      <button 
                        onClick={() => {
                          if (ch.name === 'WhatsApp') setIsConfigModalOpen(true);
                          else if (ch.name === 'Facebook') setIsFacebookConfigModalOpen(true);
                          else if (ch.name === 'Instagram') setIsInstagramConfigModalOpen(true);
                        }}
                        className={cn("w-full py-3 text-white rounded-xl text-xs font-bold tracking-wide shadow-md transition-all cursor-pointer hover:shadow-lg",
                          ch.name === 'WhatsApp' ? "bg-[#16A34A] shadow-emerald-100 hover:bg-[#15803D]" :
                          ch.name === 'Facebook' ? "bg-blue-600 shadow-blue-100 hover:bg-blue-700" :
                          "bg-pink-500 shadow-pink-100 hover:bg-pink-600"
                        )}
                      >
                        Configure Now
                      </button>
                    ) : (
                      <div className="w-full py-2.5 bg-slate-100/50 text-slate-400 rounded-xl border border-slate-200/30 text-[10px] font-bold uppercase tracking-widest italic">
                        Coming Soon
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
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



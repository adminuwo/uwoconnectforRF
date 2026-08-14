import React, { useEffect, useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import axios from 'axios';

export default function TermsModal({ isOpen, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;
    
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'}/api/admin/settings/global?key=terms_of_service`);
        setContent(res.data.value || '');
      } catch (err) {
        console.error('Failed to fetch terms of service');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#1c3824]/40 backdrop-blur-md">
      <div className="bg-white/95 backdrop-blur-xl border border-white/60 rounded-[32px] w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_20px_50px_rgba(47,89,59,0.15)] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#2f593b]/10">
          <h2 className="text-xl font-black text-[#2f593b] uppercase tracking-tight">Terms of Service</h2>
          <button onClick={onClose} className="p-2 text-[#5d7c66] hover:text-[#2f593b] hover:bg-[#d1ebd7]/50 rounded-full transition-colors focus:outline-none">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 custom-scrollbar">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#45724c]" />
            </div>
          ) : (
            <div 
              className="prose prose-sm max-w-none text-left"
              dangerouslySetInnerHTML={{ 
                __html: content || `
                  <div class="text-left text-sm text-[#4d6a54] space-y-4 leading-relaxed font-medium">
                    <p>Welcome to UwoConnect. By accessing or using our platform, you agree to be bound by these Terms of Service.</p>
                    <h3 class="font-black text-[#2f593b] text-base mt-6 mb-2">1. Acceptance of Terms</h3>
                    <p>By registering for an account, you confirm that you have read, understood, and agreed to these terms.</p>
                    <h3 class="font-black text-[#2f593b] text-base mt-6 mb-2">2. Use of Service</h3>
                    <p>You agree to use UwoConnect solely for lawful purposes and in accordance with all applicable laws and regulations.</p>
                    <h3 class="font-black text-[#2f593b] text-base mt-6 mb-2">3. Account Security</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    <h3 class="font-black text-[#2f593b] text-base mt-6 mb-2">4. Modifications</h3>
                    <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                  </div>
                ` 
              }}
            />
          )}
        </div>
        
        <div className="p-4 sm:px-6 sm:py-5 border-t border-[#2f593b]/10 bg-[#f4f9f5] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#45724c] text-white font-black text-sm uppercase tracking-widest rounded-full hover:bg-[#3b6342] shadow-lg shadow-emerald-950/10 transition-all duration-300 active:scale-[0.98]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

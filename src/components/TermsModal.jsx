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
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/admin/settings/global?key=terms_of_service`);
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
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Terms of Service</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : (
            <div 
              className="prose prose-sm prose-slate max-w-none text-left"
              dangerouslySetInnerHTML={{ 
                __html: content || `
                  <div class="text-left text-sm text-slate-600 space-y-4">
                    <p>Welcome to AisaConnect. By accessing or using our platform, you agree to be bound by these Terms of Service.</p>
                    <h3 class="font-bold text-slate-800">1. Acceptance of Terms</h3>
                    <p>By registering for an account, you confirm that you have read, understood, and agreed to these terms.</p>
                    <h3 class="font-bold text-slate-800">2. Use of Service</h3>
                    <p>You agree to use AisaConnect solely for lawful purposes and in accordance with all applicable laws and regulations.</p>
                    <h3 class="font-bold text-slate-800">3. Account Security</h3>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.</p>
                    <h3 class="font-bold text-slate-800">4. Modifications</h3>
                    <p>We reserve the right to modify these terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms.</p>
                  </div>
                ` 
              }}
            />
          )}
        </div>
        
        <div className="p-4 sm:p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}

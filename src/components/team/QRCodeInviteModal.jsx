'use client';

import React, { useState, useEffect } from 'react';
import { X, QrCode, Copy, Check, RefreshCw, Download, ShieldCheck, Sparkles } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

export default function QRCodeInviteModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState('');
  const [inviteData, setInviteData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchQRCode();
    } else {
      setInviteData(null);
      setError('');
      setCopied(false);
    }
  }, [isOpen]);

  const fetchQRCode = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`${API_BASE_URL}/api/team/invites/generate-qr/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInviteData(res.data);
    } catch (err) {
      console.error('Failed to fetch QR code invite:', err);
      setError(err.response?.data?.error || 'Failed to generate QR Code invite link.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerating will invalidate the previous QR code and link. Do you wish to proceed?')) {
      return;
    }
    setRegenerating(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`${API_BASE_URL}/api/team/invites/generate-qr/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setInviteData(res.data);
    } catch (err) {
      console.error('Failed to regenerate QR code:', err);
      setError(err.response?.data?.error || 'Failed to regenerate QR code.');
    } finally {
      setRegenerating(false);
    }
  };

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const inviteUrl = inviteData?.invite_token ? `${origin}/auth/register?invite_token=${inviteData.invite_token}` : '';
  const qrImageSrc = inviteUrl 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=10&data=${encodeURIComponent(inviteUrl)}`
    : '';

  const handleCopyLink = () => {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadQR = async () => {
    if (!qrImageSrc) return;
    try {
      const response = await fetch(qrImageSrc);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${inviteData?.business_name || 'workspace'}-team-qr-code.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      window.open(qrImageSrc, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Background Decorative Accent */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-emerald-100">
            <QrCode size={30} />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center justify-center gap-1.5">
            Team Join QR Code <Sparkles size={16} className="text-emerald-500 fill-emerald-500" />
          </h2>
          <p className="text-xs font-medium text-slate-500 max-w-xs mx-auto">
            Scan with any smartphone camera to join <span className="font-bold text-slate-800">{inviteData?.business_name || 'your workspace'}</span> as a team member.
          </p>
        </div>

        {/* Body Content */}
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={32} className="animate-spin text-emerald-600" />
            <p className="text-xs font-semibold text-slate-500">Generating secure QR code...</p>
          </div>
        ) : error ? (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-2xl text-xs text-center font-medium my-4">
            {error}
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* QR Code Container */}
            <div className="relative group bg-slate-50 p-6 rounded-3xl border border-slate-200/80 flex flex-col items-center justify-center shadow-inner">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-100 relative">
                {qrImageSrc ? (
                  <img 
                    src={qrImageSrc} 
                    alt="Workspace QR Code" 
                    className="w-52 h-52 object-contain rounded-lg" 
                  />
                ) : (
                  <div className="w-52 h-52 flex items-center justify-center text-slate-400">
                    <QrCode size={48} />
                  </div>
                )}
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                <ShieldCheck size={14} /> Unlimited Member Scans Allowed
              </div>
            </div>

            {/* Action Buttons: Download & Copy */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className={`flex-1 py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                  copied 
                    ? 'bg-emerald-600 text-white shadow-emerald-200' 
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                {copied ? 'Link Copied!' : 'Copy Invite Link'}
              </button>

              <button
                type="button"
                onClick={handleDownloadQR}
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                title="Download PNG QR Image"
              >
                <Download size={16} /> Download
              </button>
            </div>

            {/* Direct URL Box */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Direct Invite Link</label>
              <div className="flex items-center bg-slate-100/80 rounded-2xl px-3 py-2 border border-slate-200">
                <input 
                  type="text" 
                  readOnly 
                  value={inviteUrl} 
                  className="w-full bg-transparent text-xs text-slate-700 font-mono focus:outline-none select-all truncate"
                />
              </div>
            </div>

            {/* Reset / Regenerate QR Link */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={handleRegenerate}
                disabled={regenerating}
                className="text-[11px] font-bold text-slate-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw size={12} className={regenerating ? 'animate-spin' : ''} />
                Regenerate QR Code & Link
              </button>
              <span className="text-[10px] font-bold text-slate-400">Valid indefinitely</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}

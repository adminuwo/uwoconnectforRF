import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function FacebookConfigModal({ isOpen, onClose, client, onSaved }) {
  const [pageName, setPageName] = useState('');
  const [pageId, setPageId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isOpen && client) {
      const config = client.facebook_config || {};
      setPageName(config.page_name || '');
      setPageId(config.page_id || '');
      setAccessToken(config.access_token || '');
      
      setErrors({});
      setTouched({});
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const validate = (field, val) => {
    let err = '';
    if (!val) {
      err = 'This field is required';
    } else {
      if (field === 'pageId') {
        if (!/^\d+$/.test(val)) {
          err = 'Must contain only digits';
        }
      }
    }
    setErrors(prev => ({ ...prev, [field]: err }));
    return !err;
  };

  const handleBlur = (field, val) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validate(field, val);
  };

  const handleChange = (field, val, setter) => {
    setter(val);
    if (touched[field]) {
      validate(field, val);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const fieldsToValidate = { pageName, pageId, accessToken };
    let isAllValid = true;
    const newTouched = {};
    Object.keys(fieldsToValidate).forEach(key => {
      newTouched[key] = true;
      const isValid = validate(key, fieldsToValidate[key]);
      if (!isValid) isAllValid = false;
    });
    setTouched(newTouched);

    if (!isAllValid) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        facebook_enabled: true,
        facebook_config: {
          page_name: pageName,
          page_id: pageId,
          access_token: accessToken,
          last_connected: client?.facebook_config?.page_id ? (client?.facebook_config?.last_connected || new Date().toISOString()) : new Date().toISOString(),
          last_updated: new Date().toISOString()
        }
      };

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to configure Facebook API', err);
      setErrors(prev => ({ ...prev, form: 'Failed to update configuration.' }));
      setSaving(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm("Are you sure you want to disconnect this Facebook Page?")) return;
    
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      
      const payload = {
        facebook_enabled: false,
        facebook_config: {}
      };

      const res = await axios.patch(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080'}/api/profile`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      onSaved(res.data);
      onClose();
    } catch (err) {
      console.error('Failed to disconnect Facebook API', err);
      setErrors(prev => ({ ...prev, form: 'Failed to disconnect.' }));
    } finally {
      setSaving(false);
    }
  };

  const isConnected = !!client?.facebook_config?.page_id;
  const isEditMode = isConnected;

  const requiredFieldsFilled = pageName && pageId && accessToken;
  const hasBlockingErrors = Object.keys(errors).some(key => key !== 'form' && errors[key]);
  const isSubmitDisabled = !requiredFieldsFilled || hasBlockingErrors || saving;

  const lastConnectedText = client?.facebook_config?.last_connected 
    ? new Date(client.facebook_config.last_connected).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Never';

  const lastUpdatedText = client?.facebook_config?.last_updated 
    ? new Date(client.facebook_config.last_updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Never';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Left/Main Column - Form */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col min-h-0">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configure Facebook Messenger</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Connect your Facebook Messenger channel.
              </p>
            </div>
            <button 
              onClick={onClose} 
              className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all border border-slate-100/50"
            >
              <X size={18} />
            </button>
          </div>

          {errors.form && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-800 text-xs font-semibold">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Page Information</h3>
              
              {/* Page Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Page Display Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={pageName}
                  onChange={e => handleChange('pageName', e.target.value, setPageName)}
                  onBlur={e => handleBlur('pageName', e.target.value)}
                  placeholder="e.g. My Facebook Page"
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                    touched.pageName && errors.pageName 
                      ? "border-red-400 focus:ring-red-100" 
                      : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                  )}
                />
                {touched.pageName && errors.pageName && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle size={10} /> {errors.pageName}
                  </p>
                )}
              </div>

              {/* Page ID */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Facebook Page ID <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={pageId}
                  onChange={e => handleChange('pageId', e.target.value, setPageId)}
                  onBlur={e => handleBlur('pageId', e.target.value)}
                  placeholder="e.g. 109284729481028"
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                    touched.pageId && errors.pageId 
                      ? "border-red-400 focus:ring-red-100" 
                      : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                  )}
                />
                {touched.pageId && errors.pageId && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle size={10} /> {errors.pageId}
                  </p>
                )}
              </div>

              {/* Access Token */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Page Access Token <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showAccessToken ? "text" : "password"}
                    value={accessToken}
                    onChange={e => handleChange('accessToken', e.target.value, setAccessToken)}
                    onBlur={e => handleBlur('accessToken', e.target.value)}
                    placeholder="Enter Facebook Page Access Token (starts with EAA...)"
                    className={cn(
                      "w-full pl-4 pr-12 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                      touched.accessToken && errors.accessToken 
                        ? "border-red-400 focus:ring-red-100" 
                        : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowAccessToken(!showAccessToken)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {touched.accessToken && errors.accessToken && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle size={10} /> {errors.accessToken}
                  </p>
                )}
              </div>
            </div>
            {/* Footer buttons */}
            <div className="pt-5 border-t border-slate-100 flex justify-between items-center shrink-0 w-full">
              <div>
                {isEditMode && (
                  <button 
                    type="button" 
                    onClick={handleDisconnect}
                    disabled={saving}
                    className="px-4 py-3 font-bold text-red-600 hover:bg-red-50 rounded-xl transition-all text-xs cursor-pointer flex items-center gap-2"
                  >
                    Disconnect
                  </button>
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  type="button" 
                  onClick={onClose} 
                  className="px-5 py-3 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent hover:border-slate-200 rounded-xl transition-all text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitDisabled}
                  className={cn(
                    "px-6 py-3 rounded-xl font-bold text-xs shadow-lg transition-all duration-200 flex items-center gap-2 text-white border border-transparent cursor-pointer",
                    isSubmitDisabled 
                      ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
                      : "bg-[#16A34A] hover:bg-[#15803D] shadow-emerald-100"
                  )}
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  {isEditMode ? 'Update Page Config' : 'Save Page Config'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column - Status Panel */}
        <div className="w-full md:w-80 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 p-6 md:p-8 flex flex-col justify-between shrink-0">
          <div className="space-y-6">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Connection Status</h4>
              <div className="flex items-center gap-3 p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
                <span className={cn("w-2.5 h-2.5 rounded-full shrink-0", 
                  isConnected 
                    ? "bg-[#16A34A] shadow-[0_0_8px_rgba(22,163,74,0.5)]" 
                    : "bg-slate-300"
                )} />
                <span className="text-sm font-bold text-slate-800">
                  {isConnected ? 'Connected' : 'Not Connected'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata Info</h4>
              <div className="bg-white border border-slate-200/60 rounded-xl p-4 space-y-3.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Last Connected</span>
                  <span className="font-bold text-slate-800 text-right">{lastConnectedText}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">Last Updated</span>
                  <span className="font-bold text-slate-800 text-right">{lastUpdatedText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

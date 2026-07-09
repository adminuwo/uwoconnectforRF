import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Copy, Check, Loader2, ShieldAlert, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';

export default function WhatsAppConfigModal({ isOpen, onClose, client, onSaved }) {
  const [businessName, setBusinessName] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumberVal, setPhoneNumberVal] = useState('');
  const [portfolioId, setPortfolioId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAccessToken, setShowAccessToken] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Parse details when modal opens
  useEffect(() => {
    if (isOpen && client) {
      setBusinessName(client.business_name || '');
      setWabaId(client.whatsapp_waba_id || '');
      setPhoneId(client.whatsapp_phone_number_id || '');
      setPortfolioId(client.settings?.business_portfolio_id || '');
      setAccessToken(client.whatsapp_access_token || '');
      
      const fullNum = client.phone_number || '';
      const codes = ['+91', '+1', '+44', '+62', '+55', '+52', '+33', '+49', '+61', '+971', '+65'];
      const matchedCode = codes.find(code => fullNum.startsWith(code));
      if (matchedCode) {
        setCountryCode(matchedCode);
        setPhoneNumberVal(fullNum.slice(matchedCode.length).trim());
      } else {
        setCountryCode('+91');
        setPhoneNumberVal(fullNum);
      }
      setErrors({});
      setTouched({});
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const validate = (field, val) => {
    let err = '';
    if (!val && field !== 'portfolioId') {
      err = 'This field is required';
    } else {
      if (field === 'wabaId' || field === 'phoneId') {
        if (!/^\d+$/.test(val)) {
          err = 'Must contain only digits';
        } else if (val.length < 10) {
          err = 'ID is too short';
        }
      }
      if (field === 'phoneNumberVal') {
        const cleanNum = val.replace(/[\s-()]/g, '');
        if (!/^\d+$/.test(cleanNum)) {
          err = 'Must contain only digits';
        } else if (cleanNum.length < 7) {
          err = 'Phone number is too short';
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
    
    // Validate all fields
    const fieldsToValidate = {
      businessName,
      wabaId,
      phoneId,
      phoneNumberVal,
      accessToken
    };
    
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
      const formattedPhone = `${countryCode} ${phoneNumberVal.trim()}`;
      
      const payload = {
        business_name: businessName,
        phone_number: formattedPhone,
        whatsapp_waba_id: wabaId,
        whatsapp_phone_number_id: phoneId,
        whatsapp_access_token: accessToken,
        settings: {
          ...(client?.settings || {}),
          business_portfolio_id: portfolioId,
          api_version: 'v20.0',
          last_connected: client?.whatsapp_phone_number_id ? (client?.settings?.last_connected || new Date().toISOString()) : new Date().toISOString(),
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
      console.error('Failed to configure WhatsApp API', err);
      setErrors(prev => ({ ...prev, form: 'Failed to update configuration. Please verify credentials.' }));
    } finally {
      setSaving(false);
    }
  };

  const isConnected = !!client?.whatsapp_phone_number_id;
  const isEditMode = isConnected;

  const requiredFieldsFilled = 
    businessName && 
    wabaId && 
    phoneId && 
    phoneNumberVal &&
    accessToken;

  const hasBlockingErrors = Object.keys(errors).some(key => key !== 'form' && errors[key]);
  const isSubmitDisabled = !requiredFieldsFilled || hasBlockingErrors || saving;

  const lastConnectedText = client?.settings?.last_connected 
    ? new Date(client.settings.last_connected).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : 'Never';

  const lastUpdatedText = client?.settings?.last_updated 
    ? new Date(client.settings.last_updated).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
    : client?.updated_at 
      ? new Date(client.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) 
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
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Configure WhatsApp Business</h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                Connect your WhatsApp Business Cloud API.
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
              <ShieldAlert size={16} className="shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 flex-1">
            <div className="space-y-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business Information</h3>
              
              {/* Display Name */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Display Name <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text" 
                  value={businessName}
                  onChange={e => handleChange('businessName', e.target.value, setBusinessName)}
                  onBlur={e => handleBlur('businessName', e.target.value)}
                  placeholder="e.g. Acme Corp Support"
                  className={cn(
                    "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                    touched.businessName && errors.businessName 
                      ? "border-red-400 focus:ring-red-100" 
                      : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                  )}
                />
                {touched.businessName && errors.businessName && (
                  <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                    <AlertCircle size={10} /> {errors.businessName}
                  </p>
                )}
              </div>

              {/* Grid for IDs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* WABA ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    WhatsApp Business Account ID (WABA ID) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={wabaId}
                    onChange={e => handleChange('wabaId', e.target.value, setWabaId)}
                    onBlur={e => handleBlur('wabaId', e.target.value)}
                    placeholder="e.g. 1003621608783022"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                      touched.wabaId && errors.wabaId 
                        ? "border-red-400 focus:ring-red-100" 
                        : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                    )}
                  />
                  {touched.wabaId && errors.wabaId && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                      <AlertCircle size={10} /> {errors.wabaId}
                    </p>
                  )}
                </div>

                {/* Phone Number ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Phone Number ID <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="text" 
                    value={phoneId}
                    onChange={e => handleChange('phoneId', e.target.value, setPhoneId)}
                    onBlur={e => handleBlur('phoneId', e.target.value)}
                    placeholder="e.g. 1151075064754011"
                    className={cn(
                      "w-full px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                      touched.phoneId && errors.phoneId 
                        ? "border-red-400 focus:ring-red-100" 
                        : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                    )}
                  />
                  {touched.phoneId && errors.phoneId && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                      <AlertCircle size={10} /> {errors.phoneId}
                    </p>
                  )}
                </div>
              </div>

              {/* Grid for Phone and Portfolio */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    WhatsApp Business Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2 w-full">
                    {/* Country Code Selector */}
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="px-3 py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all cursor-pointer shrink-0"
                      style={{ minWidth: '85px' }}
                    >
                      <option value="+91" className="text-slate-800 bg-white">🇮🇳 +91</option>
                      <option value="+1" className="text-slate-800 bg-white">🇺🇸 +1</option>
                      <option value="+44" className="text-slate-800 bg-white">🇬🇧 +44</option>
                      <option value="+62" className="text-slate-800 bg-white">🇮🇩 +62</option>
                      <option value="+55" className="text-slate-800 bg-white">🇧🇷 +55</option>
                      <option value="+52" className="text-slate-800 bg-white">🇲🇽 +52</option>
                      <option value="+33" className="text-slate-800 bg-white">🇫🇷 +33</option>
                      <option value="+49" className="text-slate-800 bg-white">🇩🇪 +49</option>
                      <option value="+61" className="text-slate-800 bg-white">🇦🇺 +61</option>
                      <option value="+971" className="text-slate-800 bg-white">🇦🇪 +971</option>
                      <option value="+65" className="text-slate-800 bg-white">🇸🇬 +65</option>
                    </select>

                    <input 
                      type="text" 
                      value={phoneNumberVal}
                      onChange={e => handleChange('phoneNumberVal', e.target.value, setPhoneNumberVal)}
                      onBlur={e => handleBlur('phoneNumberVal', e.target.value)}
                      placeholder="98765 43210"
                      className={cn(
                        "flex-1 min-w-0 px-4 py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                        touched.phoneNumberVal && errors.phoneNumberVal 
                          ? "border-red-400 focus:ring-red-100" 
                          : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                      )}
                    />
                  </div>
                  {touched.phoneNumberVal && errors.phoneNumberVal && (
                    <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1.5">
                      <AlertCircle size={10} /> {errors.phoneNumberVal}
                    </p>
                  )}
                </div>

                {/* Portfolio ID */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Business Portfolio ID <span className="text-slate-400 font-medium">(Optional)</span>
                  </label>
                  <input 
                    type="text" 
                    value={portfolioId}
                    onChange={e => setPortfolioId(e.target.value)}
                    placeholder="e.g. 847294871904729"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Access Token */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  System User Access Token <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input 
                    type={showAccessToken ? "text" : "password"}
                    value={accessToken}
                    onChange={e => handleChange('accessToken', e.target.value, setAccessToken)}
                    onBlur={e => handleBlur('accessToken', e.target.value)}
                    placeholder="Enter Meta API Access Token (starts with EAA...)"
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
            <div className="pt-5 border-t border-slate-100 flex justify-end gap-3 shrink-0">
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
                {isEditMode ? 'Update Configuration' : 'Save Configuration'}
              </button>
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
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-medium">API Version</span>
                  <span className="font-bold text-[#16A34A] bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{client?.settings?.api_version || 'v20.0'}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Eye, EyeOff, Copy, Check, Loader2, ShieldAlert, AlertCircle, 
  Upload, User, Settings, MapPin, Clock, Globe, Mail, Building2, 
  FileText, Sparkles, Calendar, RefreshCw, CheckCircle2 
} from 'lucide-react';
import axios from 'axios';
import { cn } from '@/lib/utils';
import { API_BASE_URL } from '@/config/apiConfig';

const WHATSAPP_VERTICALS = [
  { value: 'PROF_SERVICES', label: 'Professional Services' },
  { value: 'RETAIL', label: 'Retail & Shopping' },
  { value: 'AUTO', label: 'Automotive' },
  { value: 'BEAUTY', label: 'Beauty, Spa & Salon' },
  { value: 'APPAREL', label: 'Clothing & Apparel' },
  { value: 'EDU', label: 'Education & Training' },
  { value: 'ENTERTAIN', label: 'Entertainment' },
  { value: 'EVENT_PLAN', label: 'Event Planning & Service' },
  { value: 'FINANCE', label: 'Financial Services & Banking' },
  { value: 'GROCERY', label: 'Grocery & Supermarket' },
  { value: 'GOVT', label: 'Government & Public Services' },
  { value: 'HOTEL', label: 'Hotel & Lodging' },
  { value: 'HEALTH', label: 'Medical & Healthcare' },
  { value: 'NONPROFIT', label: 'Non-profit & NGO' },
  { value: 'RESTAURANT', label: 'Restaurant & Dining' },
  { value: 'TRAVEL', label: 'Travel & Tourism' },
  { value: 'OTHER', label: 'Other' }
];

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export default function WhatsAppConfigModal({ isOpen, onClose, client, onSaved }) {
  // Navigation
  const [activeTab, setActiveTab] = useState('credentials'); // 'credentials' | 'profile' | 'hours' | 'status'

  // Tab 1: API Credentials
  const [businessName, setBusinessName] = useState('');
  const [wabaId, setWabaId] = useState('');
  const [phoneId, setPhoneId] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumberVal, setPhoneNumberVal] = useState('');
  const [portfolioId, setPortfolioId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [showAccessToken, setShowAccessToken] = useState(false);

  // Tab 2: WhatsApp Business Profile (Meta Live)
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [about, setAbout] = useState('');
  const [email, setEmail] = useState('');
  const [vertical, setVertical] = useState('PROF_SERVICES');
  const [website1, setWebsite1] = useState('');
  const [website2, setWebsite2] = useState('');

  // Tab 3: Business Hours & Timings
  const [hoursEnabled, setHoursEnabled] = useState(true);
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [workingDays, setWorkingDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']);
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('19:00');
  const [awayMessageEnabled, setAwayMessageEnabled] = useState(true);
  const [awayMessage, setAwayMessage] = useState(
    'Thank you for reaching out to us! We are currently outside our operating hours. We will respond as soon as our team is back online.'
  );

  // State & Loading
  const [saving, setSaving] = useState(false);
  const [fetchingProfile, setFetchingProfile] = useState(false);
  const [uploadingPic, setUploadingPic] = useState(false);
  const [profilePicUrl, setProfilePicUrl] = useState('');
  const [previewPicUrl, setPreviewPicUrl] = useState('');
  const fileInputRef = useRef(null);
  
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [successToast, setSuccessToast] = useState('');

  const fetchLiveProfile = async (silent = false) => {
    if (!client?.id || !client?.whatsapp_phone_number_id) return;
    if (!silent) setFetchingProfile(true);
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const apiUrl = API_BASE_URL;
      const res = await axios.get(
        `${apiUrl}/api/clients/${client.id}/get_whatsapp_business_profile/`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data?.profile) {
        const p = res.data.profile;
        if (p.address !== undefined) setAddress(p.address || '');
        if (p.description !== undefined) setDescription(p.description || '');
        if (p.about !== undefined) setAbout(p.about || '');
        if (p.email !== undefined) setEmail(p.email || '');
        if (p.vertical !== undefined) setVertical(p.vertical || 'PROF_SERVICES');
        if (p.websites && Array.isArray(p.websites)) {
          setWebsite1(p.websites[0] || '');
          setWebsite2(p.websites[1] || '');
        }
        if (p.profile_picture_url) {
          setProfilePicUrl(p.profile_picture_url);
        }
      }
      if (res.data?.business_hours) {
        const bh = res.data.business_hours;
        if (bh.enabled !== undefined) setHoursEnabled(bh.enabled);
        if (bh.timezone) setTimezone(bh.timezone);
        if (Array.isArray(bh.days) && bh.days.length > 0) setWorkingDays(bh.days);
        if (bh.open_time) setOpenTime(bh.open_time);
        if (bh.close_time) setCloseTime(bh.close_time);
        if (bh.away_message_enabled !== undefined) setAwayMessageEnabled(bh.away_message_enabled);
        if (bh.away_message) setAwayMessage(bh.away_message);
      }
      if (!silent) {
        setSuccessToast('Live WhatsApp details synced from Meta!');
        setTimeout(() => setSuccessToast(''), 3000);
      }
    } catch (err) {
      console.warn('Could not fetch WhatsApp business profile', err);
    } finally {
      if (!silent) setFetchingProfile(false);
    }
  };

  // Parse details when modal opens
  useEffect(() => {
    if (isOpen && client) {
      setBusinessName(client.business_name || '');
      setWabaId(client.whatsapp_waba_id || '');
      setPhoneId(client.whatsapp_phone_number_id || '');
      setPortfolioId(client.settings?.business_portfolio_id || '');
      setAccessToken(client.whatsapp_access_token || '');
      
      const initialPic = client.settings?.whatsapp_profile_picture_url || client.whatsapp_profile_picture_url || '';
      setProfilePicUrl(initialPic);
      setPreviewPicUrl('');

      // Prefill cached profile if exists
      const cachedProf = client.settings?.whatsapp_business_profile || {};
      if (cachedProf.address) setAddress(cachedProf.address);
      if (cachedProf.description) setDescription(cachedProf.description);
      if (cachedProf.about) setAbout(cachedProf.about);
      if (cachedProf.email) setEmail(cachedProf.email);
      if (cachedProf.vertical) setVertical(cachedProf.vertical);
      if (cachedProf.websites && Array.isArray(cachedProf.websites)) {
        setWebsite1(cachedProf.websites[0] || '');
        setWebsite2(cachedProf.websites[1] || '');
      }

      const cachedHours = client.settings?.whatsapp_business_hours || {};
      if (cachedHours.enabled !== undefined) setHoursEnabled(cachedHours.enabled);
      if (cachedHours.timezone) setTimezone(cachedHours.timezone);
      if (Array.isArray(cachedHours.days)) setWorkingDays(cachedHours.days);
      if (cachedHours.open_time) setOpenTime(cachedHours.open_time);
      if (cachedHours.close_time) setCloseTime(cachedHours.close_time);
      if (cachedHours.away_message_enabled !== undefined) setAwayMessageEnabled(cachedHours.away_message_enabled);
      if (cachedHours.away_message) setAwayMessage(cachedHours.away_message);

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
      setActiveTab('credentials');

      // Fetch live Meta profile
      fetchLiveProfile(true);
    }
  }, [isOpen, client]);

  if (!isOpen) return null;

  const handleProfilePicUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG or PNG)');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }

    const localUrl = URL.createObjectURL(file);
    setPreviewPicUrl(localUrl);
    setUploadingPic(true);

    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const apiUrl = API_BASE_URL;
      const formData = new FormData();
      formData.append('profile_picture', file);

      const res = await axios.post(
        `${apiUrl}/api/clients/${client.id}/update_whatsapp_profile_picture/`,
        formData,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );
      const newPicUrl = res.data?.profile_picture_url || localUrl;
      setProfilePicUrl(newPicUrl);
      setSuccessToast('Profile picture updated successfully on WhatsApp!');
      setTimeout(() => setSuccessToast(''), 3500);

      if (onSaved) {
        onSaved({
          ...client,
          settings: {
            ...(client.settings || {}),
            whatsapp_profile_picture_url: newPicUrl
          }
        });
      }
    } catch (err) {
      console.error('Failed to upload profile picture', err);
      alert(err.response?.data?.error || 'Failed to update profile picture on WhatsApp.');
      setPreviewPicUrl('');
    } finally {
      setUploadingPic(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const toggleDay = (day) => {
    setWorkingDays(prev => 
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const validate = (field, val) => {
    let err = '';
    if (!val && field !== 'portfolioId' && field !== 'accessToken') {
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
        const cleaned = val.replace(/[\s-]/g, '');
        if (!/^\d+$/.test(cleaned)) {
          err = 'Only numbers allowed';
        } else if (cleaned.length < 7 || cleaned.length > 15) {
          err = 'Invalid phone number length';
        }
      }
      if (field === 'accessToken' && val) {
        if (val.length < 30) {
          err = 'Access token is too short';
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
    
    // Validate credentials fields
    const fieldsToValidate = {
      businessName,
      wabaId,
      phoneId,
      phoneNumberVal,
    };
    if (accessToken) {
      fieldsToValidate.accessToken = accessToken;
    }
    
    let isAllValid = true;
    const newTouched = {};
    Object.keys(fieldsToValidate).forEach(key => {
      newTouched[key] = true;
      const isValid = validate(key, fieldsToValidate[key]);
      if (!isValid) isAllValid = false;
    });
    setTouched(newTouched);

    if (!isAllValid) {
      setActiveTab('credentials');
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem('uwo_token') || localStorage.getItem('token');
      const apiUrl = API_BASE_URL;
      const formattedPhone = `${countryCode} ${phoneNumberVal.trim()}`;

      // Sync via embedded signup endpoint first to register WABA & webhooks
      try {
        await axios.post(`${apiUrl}/api/auth/whatsapp/embedded-signup`, {
          waba_id: wabaId,
          phone_number_id: phoneId,
          access_token: accessToken || undefined,
          redirect_uri: 'https://uwoconnect.aisa24.com/client/channels'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (embErr) {
        console.warn('Embedded signup sync note:', embErr);
      }
      
      const payload = {
        business_name: businessName,
        phone_number: formattedPhone,
        whatsapp_waba_id: wabaId,
        whatsapp_phone_number_id: phoneId,
        whatsapp_enabled: true,
        ...(accessToken ? { whatsapp_access_token: accessToken } : {}),
        settings: {
          ...(client?.settings || {}),
          business_portfolio_id: portfolioId,
          api_version: 'v20.0',
          last_connected: client?.whatsapp_phone_number_id ? (client?.settings?.last_connected || new Date().toISOString()) : new Date().toISOString(),
          last_updated: new Date().toISOString()
        }
      };

      // 1. Update general Client credentials
      const profileRes = await axios.patch(
        `${apiUrl}/api/profile`, 
        payload, 
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // 2. Push WhatsApp Business Profile & Hours to Meta
      const websitesList = [website1.trim(), website2.trim()].filter(Boolean);
      await axios.post(
        `${apiUrl}/api/clients/${client.id}/update_whatsapp_business_profile/`,
        {
          profile: {
            address: address.trim(),
            description: description.trim(),
            about: about.trim(),
            email: email.trim(),
            vertical: vertical,
            websites: websitesList
          },
          business_hours: {
            enabled: hoursEnabled,
            timezone,
            days: workingDays,
            open_time: openTime,
            close_time: closeTime,
            away_message_enabled: awayMessageEnabled,
            away_message: awayMessage.trim()
          }
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setSuccessToast('WhatsApp settings & business profile updated successfully!');
      if (onSaved) onSaved(profileRes.data);
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error('Failed to configure WhatsApp API', err);
      const errMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to update WhatsApp configuration. Please verify credentials.';
      setErrors(prev => ({ ...prev, form: errMsg }));
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
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 transition-all duration-300">
      <div 
        className="bg-white w-full max-w-5xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[95dvh] sm:max-h-[92vh] border border-slate-100 animate-in fade-in zoom-in-95 duration-200 text-slate-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Persistent Top Header - ALWAYS visible */}
        <div className="flex justify-between items-center px-4 py-3 sm:px-6 sm:py-3.5 border-b border-slate-100 bg-white shrink-0">
          <div className="min-w-0 flex-1 pr-2">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 tracking-tight truncate">
                Configure WhatsApp Business
              </h2>
              <span className={cn(
                "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
                isConnected ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-slate-100 text-slate-500"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", isConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-400")} />
                {isConnected ? 'Connected' : 'Not Connected'}
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium truncate mt-0.5">
              Manage WhatsApp Cloud API, Business Profile (Location, Bio, Category) & Operating Hours.
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl transition-all border border-slate-100 shrink-0 cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Toast Message */}
        {successToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-semibold flex items-center justify-between shadow-inner animate-in fade-in shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>{successToast}</span>
            </div>
          </div>
        )}

        {/* Navigation Tabs Bar */}
        <div className="flex border-b border-slate-200/80 bg-slate-50/80 px-2 sm:px-6 gap-1 sm:gap-2 shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('credentials')}
            className={cn(
              "py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === 'credentials'
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <Settings size={14} /> API Credentials
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={cn(
              "py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === 'profile'
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <Building2 size={14} /> WhatsApp Profile <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.2 rounded-full font-extrabold uppercase">Live</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hours')}
            className={cn(
              "py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === 'hours'
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <Clock size={14} /> Business Hours & Away Reply
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('status')}
            className={cn(
              "md:hidden py-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer",
              activeTab === 'status'
                ? "border-emerald-600 text-emerald-700 bg-white rounded-t-lg shadow-sm"
                : "border-transparent text-slate-500 hover:text-slate-800"
            )}
          >
            <User size={14} /> DP & Status
          </button>
        </div>

        {/* Modal Body Container */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-0">
          {/* Main Form Area */}
          <div className={cn(
            "flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto flex flex-col min-h-0",
            activeTab === 'status' && "hidden md:flex"
          )}>
            {errors.form && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3.5 flex items-center gap-3 text-red-800 text-xs font-semibold">
                <ShieldAlert size={16} className="shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col justify-between">
              {/* TAB 1: API CREDENTIALS */}
              {activeTab === 'credentials' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                      <Settings size={14} className="text-emerald-600" /> WhatsApp Cloud API Credentials
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Enter credentials from Meta Developer Portal (WhatsApp &gt; API Setup).
                    </p>
                  </div>
                  
                  {/* Display Name */}
                  <div className="space-y-1.5">
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
                        "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                        touched.businessName && errors.businessName 
                          ? "border-red-400 focus:ring-red-100" 
                          : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                      )}
                    />
                    {touched.businessName && errors.businessName && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.businessName}
                      </p>
                    )}
                  </div>

                  {/* Grid for IDs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* WABA ID */}
                    <div className="space-y-1.5">
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
                          "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                          touched.wabaId && errors.wabaId 
                            ? "border-red-400 focus:ring-red-100" 
                            : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                        )}
                      />
                      {touched.wabaId && errors.wabaId && (
                        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle size={10} /> {errors.wabaId}
                        </p>
                      )}
                    </div>

                    {/* Phone Number ID */}
                    <div className="space-y-1.5">
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
                          "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                          touched.phoneId && errors.phoneId 
                            ? "border-red-400 focus:ring-red-100" 
                            : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                        )}
                      />
                      {touched.phoneId && errors.phoneId && (
                        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle size={10} /> {errors.phoneId}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Grid for Phone and Portfolio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        WhatsApp Business Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-2 w-full">
                        <select
                          value={countryCode}
                          onChange={e => setCountryCode(e.target.value)}
                          className="px-2.5 py-2.5 sm:px-3 sm:py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all cursor-pointer shrink-0"
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
                            "flex-1 min-w-0 px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                            touched.phoneNumberVal && errors.phoneNumberVal 
                              ? "border-red-400 focus:ring-red-100" 
                              : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                          )}
                        />
                      </div>
                      {touched.phoneNumberVal && errors.phoneNumberVal && (
                        <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                          <AlertCircle size={10} /> {errors.phoneNumberVal}
                        </p>
                      )}
                    </div>

                    {/* Portfolio ID */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700">
                        Business Portfolio ID <span className="text-slate-400 font-medium">(Optional)</span>
                      </label>
                      <input 
                        type="text" 
                        value={portfolioId}
                        onChange={e => setPortfolioId(e.target.value)}
                        placeholder="e.g. 847294871904729"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Access Token */}
                  <div className="space-y-1.5">
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
                          "w-full pl-3.5 pr-11 py-2.5 sm:pl-4 sm:pr-12 sm:py-3 bg-slate-50 border rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2",
                          touched.accessToken && errors.accessToken 
                            ? "border-red-400 focus:ring-red-100" 
                            : "border-slate-200 focus:ring-emerald-100 focus:border-emerald-600"
                        )}
                      />
                      <button
                        type="button"
                        onClick={() => setShowAccessToken(!showAccessToken)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      >
                        {showAccessToken ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {touched.accessToken && errors.accessToken && (
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.accessToken}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: WHATSAPP BUSINESS PROFILE (Interakt-style location, about, bio) */}
              {activeTab === 'profile' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3.5 flex items-start gap-3">
                    <Sparkles size={18} className="text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900">Live WhatsApp Business Profile Details</h4>
                      <p className="text-[11px] text-emerald-700 mt-0.5">
                        These details sync directly with Meta Cloud API and appear on your live WhatsApp Business contact card for all customers.
                      </p>
                    </div>
                  </div>

                  {/* Address / Location */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-600" /> Business Address / Location
                      </label>
                      <span className="text-[10px] text-slate-400">{address.length}/256</span>
                    </div>
                    <input 
                      type="text" 
                      value={address}
                      maxLength={256}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="e.g. Suite 501, Technopark Tower, MG Road, Bengaluru, India"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                    />
                    <p className="text-[10px] text-slate-400">
                      Customers can tap this address on WhatsApp to open Google Maps directly.
                    </p>
                  </div>

                  {/* Industry Category & About Tagline */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    {/* Category Vertical */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Building2 size={14} className="text-emerald-600" /> Business Category / Vertical
                      </label>
                      <select
                        value={vertical}
                        onChange={e => setVertical(e.target.value)}
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all cursor-pointer"
                      >
                        {WHATSAPP_VERTICALS.map(v => (
                          <option key={v.value} value={v.value} className="bg-white text-slate-800">
                            {v.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* About / Status */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <FileText size={14} className="text-emerald-600" /> WhatsApp Tagline / Status
                        </label>
                        <span className="text-[10px] text-slate-400">{about.length}/139</span>
                      </div>
                      <input 
                        type="text" 
                        value={about}
                        maxLength={139}
                        onChange={e => setAbout(e.target.value)}
                        placeholder="e.g. Delivering cutting-edge IT & digital solutions."
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Business Description */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">
                        Business Description (About Us)
                      </label>
                      <span className="text-[10px] text-slate-400">{description.length}/512</span>
                    </div>
                    <textarea 
                      rows={3}
                      value={description}
                      maxLength={512}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief overview of your business, services, products, and mission..."
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 resize-none"
                    />
                  </div>

                  {/* Contact Email & Websites */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Mail size={14} className="text-emerald-600" /> Business Support Email
                      </label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="support@yourdomain.com"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Globe size={14} className="text-emerald-600" /> Primary Website
                      </label>
                      <input 
                        type="url" 
                        value={website1}
                        onChange={e => setWebsite1(e.target.value)}
                        placeholder="https://yourwebsite.com"
                        className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                      />
                    </div>
                  </div>

                  {/* Secondary Website */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Globe size={14} className="text-slate-400" /> Secondary Website <span className="text-slate-400 font-medium">(Optional)</span>
                    </label>
                    <input 
                      type="url" 
                      value={website2}
                      onChange={e => setWebsite2(e.target.value)}
                      placeholder="https://shop.yourwebsite.com or https://blog.yourwebsite.com"
                      className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: BUSINESS HOURS & TIMINGS */}
              {activeTab === 'hours' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-xl">
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        <Clock size={16} className="text-emerald-600" /> Enable Business Operating Hours
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        Set working days, hours and automatic away auto-replies when your business is closed.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={hoursEnabled} 
                        onChange={e => setHoursEnabled(e.target.checked)} 
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                    </label>
                  </div>

                  {hoursEnabled && (
                    <div className="space-y-5">
                      {/* Timezone */}
                      <div className="space-y-1.5">
                        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Globe size={14} className="text-emerald-600" /> Business Timezone
                        </label>
                        <select
                          value={timezone}
                          onChange={e => setTimezone(e.target.value)}
                          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 transition-all cursor-pointer"
                        >
                          <option value="Asia/Kolkata">🇮🇳 India Standard Time (IST) - Asia/Kolkata (+05:30)</option>
                          <option value="UTC">🌐 Coordinated Universal Time (UTC) (+00:00)</option>
                          <option value="America/New_York">🇺🇸 Eastern Time (ET) - America/New_York (-05:00)</option>
                          <option value="America/Los_Angeles">🇺🇸 Pacific Time (PT) - America/Los_Angeles (-08:00)</option>
                          <option value="Europe/London">🇬🇧 Greenwich Mean Time (GMT) - Europe/London (+00:00)</option>
                          <option value="Asia/Dubai">🇦🇪 Gulf Standard Time (GST) - Asia/Dubai (+04:00)</option>
                          <option value="Asia/Singapore">🇸🇬 Singapore Time (SGT) - Asia/Singapore (+08:00)</option>
                          <option value="Australia/Sydney">🇦🇺 Australian Eastern Time (AEST) - Australia/Sydney (+10:00)</option>
                        </select>
                      </div>

                      {/* Working Days Selection */}
                      <div className="space-y-2">
                        <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Calendar size={14} className="text-emerald-600" /> Working Days
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {DAYS_OF_WEEK.map(day => {
                            const isSelected = workingDays.includes(day);
                            return (
                              <button
                                key={day}
                                type="button"
                                onClick={() => toggleDay(day)}
                                className={cn(
                                  "px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer",
                                  isSelected
                                    ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                                )}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Working Hours */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">Opening Time</label>
                          <input 
                            type="time" 
                            value={openTime}
                            onChange={e => setOpenTime(e.target.value)}
                            className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="block text-xs font-bold text-slate-700">Closing Time</label>
                          <input 
                            type="time" 
                            value={closeTime}
                            onChange={e => setCloseTime(e.target.value)}
                            className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600"
                          />
                        </div>
                      </div>

                      {/* Away Message Auto-Reply */}
                      <div className="space-y-2 pt-3 border-t border-slate-100">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500" /> Out-of-Office Away Auto-Reply
                          </label>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                              type="checkbox" 
                              checked={awayMessageEnabled} 
                              onChange={e => setAwayMessageEnabled(e.target.checked)} 
                              className="sr-only peer"
                            />
                            <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1px] after:left-[1px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3.5 after:w-3.5 after:transition-all peer-checked:bg-emerald-600"></div>
                          </label>
                        </div>
                        <textarea 
                          rows={3}
                          value={awayMessage}
                          disabled={!awayMessageEnabled}
                          onChange={e => setAwayMessage(e.target.value)}
                          placeholder="Message sent to customers who message outside business hours..."
                          className={cn(
                            "w-full px-3.5 py-2.5 sm:px-4 sm:py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm font-medium transition-all duration-200 text-slate-800 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-emerald-100 focus:border-emerald-600 resize-none",
                            !awayMessageEnabled && "opacity-50 cursor-not-allowed"
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 sm:pt-5 border-t border-slate-100 flex items-center justify-between gap-3 shrink-0 mt-4">
                <button
                  type="button"
                  onClick={() => fetchLiveProfile()}
                  disabled={fetchingProfile || !isConnected}
                  className="px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  title="Sync profile details from Meta"
                >
                  <RefreshCw size={13} className={cn(fetchingProfile && "animate-spin text-emerald-600")} />
                  <span className="hidden sm:inline">Sync Live from Meta</span>
                </button>

                <div className="flex items-center gap-2.5">
                  <button 
                    type="button" 
                    onClick={onClose} 
                    className="px-4 py-2.5 sm:px-5 sm:py-3 font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-800 border border-transparent hover:border-slate-200 rounded-xl transition-all text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSubmitDisabled}
                    className={cn(
                      "px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-bold text-xs shadow-lg transition-all duration-200 flex items-center gap-2 text-white border border-transparent cursor-pointer",
                      isSubmitDisabled 
                        ? "bg-slate-200 text-slate-400 shadow-none cursor-not-allowed" 
                        : "bg-[#16A34A] hover:bg-[#15803D] shadow-emerald-100"
                    )}
                  >
                    {saving && <Loader2 size={14} className="animate-spin" />}
                    {isEditMode ? 'Update & Sync to WhatsApp' : 'Save Configuration'}
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column - Status & Profile Panel */}
          <div className={cn(
            "w-full md:w-80 bg-slate-50/70 border-t md:border-t-0 md:border-l border-slate-100 p-4 sm:p-6 md:p-8 flex flex-col justify-between shrink-0 overflow-y-auto",
            activeTab !== 'status' && "hidden md:flex"
          )}>
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2.5 sm:mb-3">Connection Status</h4>
                <div className="flex items-center gap-3 p-3.5 sm:p-4 bg-white border border-slate-200/60 rounded-xl shadow-sm">
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

              <div className="space-y-3 sm:space-y-4">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metadata Info</h4>
                <div className="bg-white border border-slate-200/60 rounded-xl p-3.5 sm:p-4 space-y-3 text-xs">
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

              {isConnected && (
                <div className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-200/60">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Picture</h4>
                    {fetchingProfile && (
                      <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                        <Loader2 size={10} className="animate-spin" /> Syncing...
                      </span>
                    )}
                  </div>
                  <div className="bg-white border border-slate-200/60 rounded-xl p-4 flex flex-col items-center gap-3 text-center shadow-sm">
                    <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center overflow-hidden border-2 border-emerald-200 shadow-sm relative group">
                      {(previewPicUrl || profilePicUrl) ? (
                        <img 
                          src={previewPicUrl || profilePicUrl} 
                          alt="WhatsApp Display Picture" 
                          className="w-full h-full object-cover"
                          onError={() => {
                            if (previewPicUrl) setPreviewPicUrl('');
                            else setProfilePicUrl('');
                          }}
                        />
                      ) : (
                        <User size={30} className="text-emerald-500" />
                      )}
                      {uploadingPic && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
                          <Loader2 size={20} className="text-white animate-spin" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-semibold text-slate-800">
                        {(previewPicUrl || profilePicUrl) ? 'Live WhatsApp DP' : 'No Display Picture'}
                      </p>
                      <p className="text-[10px] text-slate-400">Update your live WhatsApp display picture.</p>
                    </div>
                    
                    <input 
                      type="file" 
                      accept="image/jpeg, image/png" 
                      ref={fileInputRef} 
                      className="hidden" 
                      onChange={handleProfilePicUpload} 
                    />
                    
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPic}
                      className="w-full py-2 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 border border-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {uploadingPic ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                      {uploadingPic ? 'Uploading to Meta...' : 'Upload New Picture'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

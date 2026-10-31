'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/apiConfig';

const DEFAULT_BRAND = {
  is_whitelabel: false,
  client_id: null,
  brand_name: 'UWO Connect',
  tagline: 'Multi-channel automation platform',
  logo_url: '/logo.png',
  favicon_url: '/favicon.png',
  primary_color: '#059669',
  accent_color: '#10B981',
  support_email: 'support@uwoconnect.com',
  copyright_text: '© UWO Connect Automation. All rights reserved.',
  custom_domain: ''
};

const BrandContext = createContext({
  brand: DEFAULT_BRAND,
  isWhiteLabel: false,
  loading: true,
  refreshBrand: () => {}
});

export function BrandProvider({ children }) {
  const [brand, setBrand] = useState(DEFAULT_BRAND);
  const [loading, setLoading] = useState(true);

  const applyBrandToDOM = useCallback((brandData) => {
    if (typeof document === 'undefined') return;

    // 1. Apply Dynamic CSS Theme Variables
    const root = document.documentElement;
    if (brandData.primary_color) {
      root.style.setProperty('--brand-primary', brandData.primary_color);
      root.style.setProperty('--color-primary', brandData.primary_color);
    }
    if (brandData.accent_color) {
      root.style.setProperty('--brand-accent', brandData.accent_color);
    }

    // 2. Update Page Title if custom brand name present
    if (brandData.is_whitelabel && brandData.brand_name) {
      if (document.title.includes('UWO Connect')) {
        document.title = document.title.replace(/UWO Connect/g, brandData.brand_name);
      } else if (document.title.includes('UwoConnect')) {
        document.title = document.title.replace(/UwoConnect/g, brandData.brand_name);
      }
    }

    // 3. Update Favicon dynamically
    if (brandData.favicon_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.getElementsByTagName('head')[0].appendChild(link);
      }
      link.href = brandData.favicon_url;
    }
  }, []);

  const fetchBrandConfig = useCallback(async () => {
    try {
      setLoading(true);
      let host = typeof window !== 'undefined' ? window.location.hostname : '';
      
      // Support instant local testing via ?brand_domain=query param or session cache
      if (typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        const queryBrandDomain = urlParams.get('brand_domain') || urlParams.get('domain');
        if (queryBrandDomain) {
          host = queryBrandDomain;
          sessionStorage.setItem('test_brand_domain', queryBrandDomain);
        } else if ((host === 'localhost' || host === '127.0.0.1') && sessionStorage.getItem('test_brand_domain')) {
          host = sessionStorage.getItem('test_brand_domain');
        }
      }
      
      // Query whitelabel configuration for domain
      const res = await axios.get(`${API_BASE_URL}/api/whitelabel/config?domain=${host}`);
      
      if (res.data && res.data.is_whitelabel) {
        const cleanLogo = res.data.logo_url && !res.data.logo_url.includes('download (3).gif')
          ? res.data.logo_url
          : DEFAULT_BRAND.logo_url;
        const cleanFavicon = res.data.favicon_url && !res.data.favicon_url.includes('download (3).gif')
          ? res.data.favicon_url
          : DEFAULT_BRAND.favicon_url;
        const mergedBrand = {
          ...DEFAULT_BRAND,
          ...res.data,
          brand_name: res.data.brand_name || DEFAULT_BRAND.brand_name,
          logo_url: cleanLogo,
          favicon_url: cleanFavicon,
        };
        setBrand(mergedBrand);
        applyBrandToDOM(mergedBrand);
      } else {
        setBrand(DEFAULT_BRAND);
        applyBrandToDOM(DEFAULT_BRAND);
      }
    } catch (err) {
      console.warn('[BrandContext] Falling back to default branding:', err?.message || err);
      setBrand(DEFAULT_BRAND);
      applyBrandToDOM(DEFAULT_BRAND);
    } finally {
      setLoading(false);
    }
  }, [applyBrandToDOM]);

  useEffect(() => {
    fetchBrandConfig();
  }, [fetchBrandConfig]);

  // Listen to custom events when user logs in, updates profile, or switches tenant
  useEffect(() => {
    const handleProfileUpdate = () => {
      fetchBrandConfig();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);
    window.addEventListener('brandUpdated', handleProfileUpdate);
    window.addEventListener('storage', handleProfileUpdate);
    return () => {
      window.removeEventListener('profileUpdated', handleProfileUpdate);
      window.removeEventListener('brandUpdated', handleProfileUpdate);
      window.removeEventListener('storage', handleProfileUpdate);
    };
  }, [fetchBrandConfig]);

  return (
    <BrandContext.Provider
      value={{
        brand,
        isWhiteLabel: Boolean(brand.is_whitelabel),
        loading,
        refreshBrand: fetchBrandConfig
      }}
    >
      {children}
    </BrandContext.Provider>
  );
}

export const useBrand = () => useContext(BrandContext);

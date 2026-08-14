/**
 * Central API configuration.
 * Uses runtime-computed base URL so that:
 *  - ngrok/external → '' (relative, proxied by Next.js)
 *  - LAN IP (192.168.x.x) → http://<same-host>:8080
 *  - localhost → http://127.0.0.1:8080
 *  - production → https://uwoconnectforrb-743928421487.asia-south1.run.app
 */

const PRIVATE_IP_REGEX = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;

const getApiBaseUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
};

export const getUnifiedApiBaseUrl = () => {
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    if (currentHost && currentHost !== 'localhost' && currentHost !== '127.0.0.1') {
      return (
        process.env.NEXT_PUBLIC_UNIFIED_BACKEND_API ||
        'https://unified-dashboard-977864306871.asia-south1.run.app/api'
      );
    }
  }
  return process.env.NEXT_PUBLIC_UNIFIED_BACKEND_API || 'http://localhost:8000/api';
};

export const UNIFIED_API_BASE_URL = getUnifiedApiBaseUrl();

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;


export const PUBLIC_APP_URL = (function () {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  if (process.env.NEXT_PUBLIC_FRONTEND_URL) {
    return process.env.NEXT_PUBLIC_FRONTEND_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://uwoconnectforrf-743928421487.asia-south1.run.app';
})();

export const getPublicDocumentUrl = (type, token) => {
  const normType = (type || 'quote').toLowerCase();
  let segment = 'proposal';
  if (normType === 'quotation' || normType === 'quote') {
    segment = 'quotation';
  } else if (normType === 'invoice') {
    segment = 'invoice';
  } else if (normType === 'proposal') {
    segment = 'proposal';
  }
  return `${PUBLIC_APP_URL}/public/${segment}/${token}`;
};


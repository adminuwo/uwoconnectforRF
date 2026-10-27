/**
 * Central API configuration.
 * Resolves the backend API base URL dynamically:
 *  - Explicit NEXT_PUBLIC_API_URL env var always takes highest priority
 *  - localhost / 127.0.0.1 → http://127.0.0.1:8000 (Django default port)
 *  - LAN IP (192.168.x.x) → http://<same-host>:8000
 *  - Production browser → '' (relative /api/* path, proxied by Next.js rewrites)
 *  - Production SSR/Node → process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app'
 */

const PRIVATE_IP_REGEX = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;

const getApiBaseUrl = () => {
  // 1. Explicit env variable always takes highest priority
  if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.trim()) {
    return process.env.NEXT_PUBLIC_API_URL.trim().replace(/\/$/, '');
  }

  // 2. Browser runtime context
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://127.0.0.1:8080';
    }
    if (PRIVATE_IP_REGEX.test(currentHost)) {
      return `http://${currentHost}:8080`;
    }
    // External/Production domain (e.g. uwoconnect.aisa24.com, Cloud Run frontend)
    // Return empty string so all requests use relative /api/... paths proxied by Next.js
    return '';
  }

  // 3. Node.js / SSR context fallback
  return process.env.NODE_ENV === 'production'
    ? 'https://uwoconnectforrb-743928421487.asia-south1.run.app'
    : 'http://127.0.0.1:8080';
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
  return process.env.NEXT_PUBLIC_UNIFIED_BACKEND_API || 'https://unified-dashboard-977864306871.asia-south1.run.app/api';
};

export const UNIFIED_API_BASE_URL = getUnifiedApiBaseUrl();

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = API_BASE_URL;


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
  return 'https://uwoconnect.aisa24.com';
})();

export const getPublicDocumentUrl = (type, token, customDomain = null) => {
  const normType = (type || 'quote').toLowerCase();
  let segment = 'proposal';
  if (normType === 'quotation' || normType === 'quote') {
    segment = 'quotation';
  } else if (normType === 'invoice') {
    segment = 'invoice';
  } else if (normType === 'proposal') {
    segment = 'proposal';
  }

  let baseUrl = PUBLIC_APP_URL;
  if (customDomain) {
    baseUrl = customDomain.startsWith('http') ? customDomain.replace(/\/$/, '') : `https://${customDomain.replace(/\/$/, '')}`;
  }
  return `${baseUrl}/public/${segment}/${token}`;
};


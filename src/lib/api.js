/**
 * Runtime API base URL resolver.
 * 
 * When accessed via ngrok/external URL → returns '' (empty string)
 * so all axios/fetch calls use relative /api/* paths.
 * Next.js rewrites in next.config.js then proxy /api/* → local backend.
 * 
 * When accessed via LAN IP (192.168.x.x:3000) → returns http://<same-host>:8080
 * When accessed via localhost → returns http://127.0.0.1:8080
 */

const PRIVATE_IP_REGEX = /^(127\.|10\.|192\.168\.|172\.(1[6-9]|2[0-9]|3[01])\.)/;

export function getApiBase() {
  if (typeof window === 'undefined') {
    // Server-side: use env var directly
    return process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8080';
  }

  const host = window.location.hostname;

  // External access (ngrok, vercel, run.app, etc.) → use relative URLs
  if (!PRIVATE_IP_REGEX.test(host) && host !== 'localhost') {
    if (host.includes('run.app') || host.includes('uwoconnect')) {
      return 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    }
    // ngrok, vercel, or any other external domain → relative URL (Next.js proxies)
    return '';
  }

  // LAN or localhost access → use backend on same host, port 8080
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://127.0.0.1:8080';
  }

  // LAN IP (192.168.x.x, etc.)
  return `http://${host}:8080`;
}

// Singleton — computed once per page load
let _cachedBase = null;
export function getApiBaseOnce() {
  if (_cachedBase === null) {
    _cachedBase = getApiBase();
  }
  return _cachedBase;
}

export default getApiBase;

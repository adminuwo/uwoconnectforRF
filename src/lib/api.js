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
  if (typeof window !== 'undefined' && window.location) {
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') {
      return 'http://127.0.0.1:8080';
    }
    if (PRIVATE_IP_REGEX.test(currentHost)) {
      return `http://${currentHost}:8080`;
    }
  }
  return process.env.NEXT_PUBLIC_API_URL || 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
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

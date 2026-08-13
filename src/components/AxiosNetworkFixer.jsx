'use client';

import { useEffect } from 'react';
import axios from 'axios';

/**
 * AxiosNetworkFixer — mounts once at root layout.
 *
 * Problem: Pages use `process.env.NEXT_PUBLIC_API_URL` directly in axios calls.
 * That env var is baked in at build time as a LAN IP (e.g. http://192.168.29.228:8080).
 * When a phone accesses via ngrok, that LAN IP is unreachable → AxiosError: Network Error.
 *
 * Fix: A global axios request interceptor strips the private-IP origin from URLs
 * so they become relative paths (e.g. /api/profile).
 * Next.js rewrites in next.config.js then proxy /api/* → the real backend.
 */

// Matches the full origin (scheme + host + optional port) of any private/LAN IP
const PRIVATE_ORIGIN_RE = /^https?:\/\/(192\.168\.[0-9.]+|10\.[0-9.]+|172\.(1[6-9]|2[0-9]|3[01])\.[0-9.]+|127\.0\.0\.1|localhost)(:\d+)?/;

function isExternalHost(host) {
  return !(
    host === 'localhost' ||
    host === '127.0.0.1' ||
    /^192\.168\./.test(host) ||
    /^10\./.test(host) ||
    /^172\.(1[6-9]|2[0-9]|3[01])\./.test(host)
  );
}

export default function AxiosNetworkFixer() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const host = window.location.hostname;
    if (!isExternalHost(host)) return; // LAN or localhost — no fix needed

    // For production Cloud Run domain, redirect to production backend
    const rewriteBase = (host.includes('run.app') || host.includes('uwoconnectforrf'))
      ? 'https://uwoconnectforrb-743928421487.asia-south1.run.app'
      : ''; // ngrok / vercel / other → relative path (Next.js rewrites proxy)

    const interceptorId = axios.interceptors.request.use((config) => {
      const url = config.url || '';
      if (PRIVATE_ORIGIN_RE.test(url)) {
        // Strip the private origin, prepend rewriteBase ('' = relative)
        config.url = rewriteBase + url.replace(PRIVATE_ORIGIN_RE, '');
      }
      return config;
    });

    return () => {
      axios.interceptors.request.eject(interceptorId);
    };
  }, []);

  return null;
}

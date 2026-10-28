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
    const isLocal = host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host) || /^10\./.test(host) || /^172\./.test(host);

    const interceptorId = axios.interceptors.request.use((config) => {
      const url = config.url || '';
      
      if (isLocal) {
        // When developing locally, redirect Cloud Run backend requests to local Django backend
        if (url.includes('uwoconnectforrb-743928421487.asia-south1.run.app') && !config._retried) {
          config.url = url.replace('https://uwoconnectforrb-743928421487.asia-south1.run.app', 'http://127.0.0.1:8000');
        } else if (host === 'localhost' || host === '127.0.0.1') {
          // Map LAN IP to 127.0.0.1
          if (/^https?:\/\/(192\.168\.[0-9.]+|10\.[0-9.]+|172\.(1[6-9]|2[0-9]|3[01])\.[0-9.]+):8000/.test(url)) {
            config.url = url.replace(/^https?:\/\/[^/]+/, 'http://127.0.0.1:8000');
          }
        }
      } else if (isExternalHost(host)) {
        // For production/external domain, proxy via relative path or configured NEXT_PUBLIC_API_URL
        const rewriteBase = (process.env.NEXT_PUBLIC_API_URL && !PRIVATE_ORIGIN_RE.test(process.env.NEXT_PUBLIC_API_URL))
          ? process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, '')
          : ''; // ngrok / vercel / custom domain → relative path (Next.js rewrites proxy)

        if (PRIVATE_ORIGIN_RE.test(url)) {
          config.url = rewriteBase + url.replace(PRIVATE_ORIGIN_RE, '');
        }
      }
      return config;
    });

    const responseInterceptorId = axios.interceptors.response.use(
      (response) => {
        // Safely unwrap Django REST Framework paginated responses
        if (response.data && response.data.results !== undefined && Array.isArray(response.data.results)) {
          const keys = Object.keys(response.data);
          const standardKeys = ['count', 'next', 'previous', 'results'];
          const isStandardPagination = keys.every(key => standardKeys.includes(key));
          
          if (isStandardPagination) {
            const arr = response.data.results;
            arr.pagination = {
              count: response.data.count,
              next: response.data.next,
              previous: response.data.previous
            };
            response.data = arr;
          }
        }
        return response;
      },
      async (error) => {
        const config = error.config;
        if (!config || config._retried) {
          return Promise.reject(error);
        }

        // Catch Axios Network Error when local port is unreachable, retry on alternate port
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error' || !error.response) {
          config._retried = true;

          if (config.url && config.url.includes('127.0.0.1:8080')) {
            config.url = config.url.replace('http://127.0.0.1:8080', 'http://127.0.0.1:8000');
            return axios(config);
          } else if (config.url && config.url.includes('127.0.0.1:8000')) {
            config.url = config.url.replace('http://127.0.0.1:8000', 'http://127.0.0.1:8080');
            return axios(config);
          }
        }

        // Handle 401 Unauthorized (Expired or invalid session token)
        if (error.response?.status === 401) {
          if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            const isAuthRoute = currentPath.startsWith('/auth') || currentPath.startsWith('/public');
            const isAuthEndpoint = config.url && (config.url.includes('/api/auth/login') || config.url.includes('/api/auth/register'));

            // Always purge stale expired credentials
            if (!isAuthEndpoint) {
              localStorage.removeItem('token');
              localStorage.removeItem('uwo_token');
              localStorage.removeItem('user');
              localStorage.removeItem('cached_client_channels');
            }

            if (!isAuthRoute && !isAuthEndpoint && !window._uwo_redirecting_to_login) {
              window._uwo_redirecting_to_login = true;
              console.warn('[Session Expired]: Stale or expired token. Clearing session and redirecting to login...');
              setTimeout(() => {
                window.location.href = `/auth/login?expired=1&redirect=${encodeURIComponent(currentPath)}`;
              }, 150);
            }
          }
          return Promise.reject(error);
        }

        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(interceptorId);
      axios.interceptors.response.eject(responseInterceptorId);
    };
  }, []);

  return null;
}

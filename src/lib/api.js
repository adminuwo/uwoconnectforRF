/**
 * Runtime API base URL resolver.
 * Re-exports the central API_BASE_URL configuration from @/config/apiConfig
 */

import { API_BASE_URL, getApiBaseUrl } from '../config/apiConfig';

export function getApiBase() {
  return API_BASE_URL || getApiBaseUrl();
}

let _cachedBase = null;
export function getApiBaseOnce() {
  if (_cachedBase === null) {
    _cachedBase = getApiBase();
  }
  return _cachedBase;
}

export default getApiBase;

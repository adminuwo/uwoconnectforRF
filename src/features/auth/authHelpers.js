import { auth } from '@/lib/firebase';

/**
 * Get the current JWT token from localStorage.
 */
export async function getFirebaseToken() {
  return localStorage.getItem('uwo_token') || localStorage.getItem('token');
}

/**
 * Get authorization headers for API calls.
 */
export async function getAuthHeaders() {
  const token = await getFirebaseToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Store user data after successful login + backend verification.
 */
export function storeUserSession(token, user) {
  // Purge previous session artifacts
  localStorage.removeItem('client_company_logo');
  localStorage.removeItem('cached_client_channels');
  localStorage.removeItem('impersonation_session');
  localStorage.removeItem('admin_backup_token');
  localStorage.removeItem('admin_backup_user');

  localStorage.setItem('token', token);
  localStorage.setItem('uwo_token', token);
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
    if (user.client?.company_logo_url || user.company_logo_url) {
      localStorage.setItem('client_company_logo', user.client?.company_logo_url || user.company_logo_url);
    }
  }

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('brandUpdated'));
    window.dispatchEvent(new CustomEvent('profileUpdated', { detail: user }));
  }
}

/**
 * Clear user session (logout).
 */
export function clearUserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('uwo_token');
  localStorage.removeItem('uwo_access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('client_company_logo');
  localStorage.removeItem('cached_client_channels');
  localStorage.removeItem('impersonation_session');
  localStorage.removeItem('admin_backup_token');
  localStorage.removeItem('admin_backup_user');
  localStorage.removeItem('aisa_tour_pending');
  localStorage.removeItem('aisa_tour_step');

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('brandUpdated'));
  }
}

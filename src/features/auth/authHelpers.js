import { auth } from '@/lib/firebase';

/**
 * Get the current JWT token from localStorage.
 */
export async function getFirebaseToken() {
  return localStorage.getItem('token');
}

/**
 * Get authorization headers for API calls.
 */
export async function getAuthHeaders() {
  const token = await getFirebaseToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Store user data after successful Firebase login + backend verification.
 */
export function storeUserSession(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

/**
 * Clear user session (logout).
 */
export function clearUserSession() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('client_company_logo');
  localStorage.removeItem('aisa_tour_pending');
  localStorage.removeItem('aisa_tour_step');
}

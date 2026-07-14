import { auth } from './firebase';

/**
 * Get the current Firebase user's ID token.
 * This refreshes automatically if expired.
 * Falls back to localStorage token for backward compatibility.
 */
export async function getFirebaseToken() {
  const user = auth.currentUser;
  if (user) {
    try {
      const token = await user.getIdToken(/* forceRefresh */ false);
      // Keep localStorage in sync so existing code still works
      localStorage.setItem('token', token);
      return token;
    } catch (err) {
      console.error('Failed to get Firebase ID token:', err);
    }
  }
  // Fallback to stored token
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
  localStorage.removeItem('aisa_tour_pending');
  localStorage.removeItem('aisa_tour_step');
}

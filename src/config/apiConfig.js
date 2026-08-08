const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    if (window.location.hostname.includes('uwoconnectforf') || window.location.hostname.includes('run.app')) {
      return 'https://uwoconnectforb-743978421487.asia-south1.run.app';
    }
  }
  return envUrl || 'http://127.0.0.1:8080';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;


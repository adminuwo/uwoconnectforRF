const getApiBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && !envUrl.includes('127.0.0.1') && !envUrl.includes('localhost')) {
    return envUrl;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('uwoconnectforrf') || host.includes('uwoconnectforf') || host.includes('run.app')) {
      return 'https://uwoconnectforrb-743928421487.asia-south1.run.app';
    }
    if (host !== 'localhost' && host !== '127.0.0.1') {
      return `http://${host}:8080`;
    }
  }
  return envUrl || 'http://127.0.0.1:8080';
};

export const API_BASE_URL = getApiBaseUrl();
export const API_URL = `${API_BASE_URL}/api`;


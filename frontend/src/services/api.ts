import axios from 'axios';
import { auth } from '@/config/firebase';

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';

  if (isHttps) {
    if (envUrl && envUrl.startsWith('https://')) {
      return envUrl;
    }
    // Avoid Mixed Content error on HTTPS
    return '';
  }

  return envUrl || (import.meta.env.DEV ? 'http://localhost:3001' : '');
}

const baseURL = resolveBaseUrl();

export const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Inject Firebase auth token for admin routes
api.interceptors.request.use(async (config) => {
  const user = auth.currentUser;
  if (user && config.url?.startsWith('/admin')) {
    try {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // If token fetch fails, proceed without auth header
    }
  }
  return config;
});

// Global error normalisation
api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401) {
        console.warn('[API] Unauthorized — token may be expired.');
      }
      if (status === 503) {
        console.warn('[API] Service unavailable.');
      }
    }
    return Promise.reject(error);
  },
);

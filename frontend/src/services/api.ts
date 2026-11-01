import axios from 'axios';
import { auth } from '@/config/firebase';

const baseURL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? 'http://localhost:3001' : 'https://api.gdmlive.web.app');

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

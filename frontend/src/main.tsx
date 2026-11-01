import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Initialize auth state listener before render
import { useAuthStore } from '@/store/authStore';
useAuthStore.getState().init();

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Register Service Worker for PWA offline support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(() => {
        console.log('[GDM] Service Worker registrado com sucesso.');
      })
      .catch((err) => {
        console.warn('[GDM] Service Worker não registrado:', err);
      });
  });
}


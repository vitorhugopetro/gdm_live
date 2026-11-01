// GDM Live Radio — Service Worker v2
// Strategy: Cache-First for static assets, Network-First for API, Skip audio

const CACHE_NAME = 'gdmlr-v2';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/robots.txt',
  '/images/hero-art-hyperrealistic.jpg',
  '/images/player-album-art.jpg',
  '/images/logo-gdm.png',
];

// Install: pre-cache key static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Ignore failures for missing assets
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip audio files (too large, always stream)
  if (url.pathname.startsWith('/audio/') || url.pathname.includes('.mp3')) return;

  // Skip API calls (always network)
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/stream')) return;

  // Skip external resources (CDN, Firebase, etc.)
  if (!url.origin.includes(self.location.hostname) && !url.hostname.includes('web.app')) return;

  // Cache-First for static assets (JS, CSS, images, fonts)
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;

      return fetch(request)
        .then((response) => {
          // Only cache successful responses for same-origin
          if (
            response.ok &&
            response.status === 200 &&
            response.type === 'basic'
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Fallback to index.html for navigation requests (SPA)
          if (request.mode === 'navigate') {
            return caches.match('/index.html');
          }
        });
    })
  );
});

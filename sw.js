const CACHE_NAME = 'brogrillen-v1';
const IMAGES_CACHE = 'brogrillen-images-v1';
const STATIC_CACHE = 'brogrillen-static-v1';

// Assets to cache immediately on install
const CRITICAL_ASSETS = [
  '/',
  '/index.html',
  '/menu.js',
  '/BrogrillenLogo.webp',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/site.webmanifest'
];

// Image extensions to cache with a different strategy
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

// Install event - cache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CRITICAL_ASSETS))
      .then(() => self.skipWaiting()) // Force activation on all clients
  );
});

// Helper to determine if a request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  return IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// Fetch event - serve from cache when available
self.addEventListener('fetch', (event) => {
  const request = event.request;
  
  // Different caching strategies based on request type
  if (isImageRequest(request)) {
    // Stale-while-revalidate for images
    event.respondWith(
      caches.open(IMAGES_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            cache.put(request, networkResponse.clone());
            return networkResponse;
          });
          return response || fetchPromise;
        });
      })
    );
  } else {
    // Network-first for other assets
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match(request);
      })
    );
  }
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME, IMAGES_CACHE, STATIC_CACHE];
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete outdated caches
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of clients
  );
}); 
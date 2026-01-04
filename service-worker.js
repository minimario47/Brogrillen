const CACHE_NAME = 'brogrillen-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './css/variables.css',
    './css/base.css',
    './css/skeleton-loading.css',
    './css/components.css',
    './css/menu.css',
    './css/sections.css',
    './css/dark-mode.css',
    './css/responsive.css',
    './css/admin.css',
    './js/translations.js',
    './js/dark-mode.js',
    './js/directions.js',
    './js/back-to-top.js',
    './js/opening-hours.js',
    './js/menu-loader.js',
    './js/menu-rating.js',
    './js/menu-display.js',
    './js/menu-search.js',
    './js/news-gallery.js',
    './utsida.jpg',
    './BrogrillenLogo.webp',
    './favicon-32x32.png',
    './favicon-16x16.png',
    './apple-touch-icon.png'
];

// Install Event
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate Event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
    // Skip cross-origin requests (like Supabase or CDN) for now to be safe, 
    // or handle them with specific strategies.
    if (!event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Return cached response if found
                if (response) {
                    return response;
                }
                // Otherwise fetch from network
                return fetch(event.request);
            })
    );
});

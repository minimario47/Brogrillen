// Brogrillen Pizzeria service worker
// Strategy:
//   - HTML/CSS/JS (same-origin): network-first, fall back to cache (so deploys
//     are picked up immediately instead of being masked by a stale cache).
//   - Images (same-origin): stale-while-revalidate.
//   - Cross-origin (Supabase, CDNs): bypass the service worker entirely.

const CACHE_NAME = 'brogrillen-v2';

// Core shell that's safe to pre-cache (all known to exist).
const PRECACHE_ASSETS = [
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
    './css/mobile-nav.css',
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
    './favicon-32x32.png',
    './favicon-16x16.png',
    './apple-touch-icon.png'
];

const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.ico'];

function isImageRequest(url) {
    return IMAGE_EXTENSIONS.some(ext => url.pathname.toLowerCase().endsWith(ext));
}

// Install: pre-cache the shell. Cache each asset individually so one missing
// file can't abort the whole install (the old code used addAll, which did).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) =>
            Promise.allSettled(PRECACHE_ASSETS.map((asset) => cache.add(asset)))
        ).then(() => self.skipWaiting())
    );
});

// Activate: drop old caches and take control of open pages immediately.
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((names) =>
            Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const request = event.request;

    // Only handle GET requests.
    if (request.method !== 'GET') return;

    const url = new URL(request.url);

    // Let cross-origin requests (Supabase API, CDNs) go straight to the network.
    if (url.origin !== self.location.origin) return;

    if (isImageRequest(url)) {
        // Stale-while-revalidate for images.
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) =>
                cache.match(request).then((cached) => {
                    const network = fetch(request).then((response) => {
                        if (response && response.ok) cache.put(request, response.clone());
                        return response;
                    }).catch(() => cached);
                    return cached || network;
                })
            )
        );
        return;
    }

    // Network-first for documents, CSS and JS.
    event.respondWith(
        fetch(request).then((response) => {
            if (response && response.ok) {
                const copy = response.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
            }
            return response;
        }).catch(() =>
            caches.match(request).then((cached) => cached || caches.match('./index.html'))
        )
    );
});

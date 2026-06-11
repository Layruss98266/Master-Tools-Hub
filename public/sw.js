const CACHE_NAME = 'master-dev-hub-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './favicon.svg',
  './icons.svg',
  './data/tools-data.js',
  './data/tech-data.js',
  './data/search-index.js'
];

// Install Event - Pre-cache shell assets & datasets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => {
      return self.skipWaiting();
    })
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// Fetch Event - Stale-While-Revalidate Strategy
self.addEventListener('fetch', (event) => {
  // Only handle local/GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Intercept same-origin requests or Google Favicons API
  const isSameOrigin = url.origin === self.location.origin;
  const isGoogleFavicon = url.hostname.includes('google.com') && url.pathname.includes('favicons');
  const isDdgFavicon = url.hostname.includes('icons.duckduckgo.com');

  if (isSameOrigin || isGoogleFavicon || isDdgFavicon) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          const fetchPromise = fetch(event.request).then((networkResponse) => {
            if (networkResponse.status === 200) {
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Offline fallback or swallow network error
          });

          return cachedResponse || fetchPromise;
        });
      })
    );
  }
});

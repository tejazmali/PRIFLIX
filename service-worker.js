// Set cache version for your app
const CACHE_VERSION = 'v2'; // Update this version when you make changes
const CACHE_NAME = `priflix-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Files to cache (HTML, CSS, JS)
const FILES_TO_CACHE = [ 
  '/index.html',
  '/offline.html',
  '/header.html',
  '/footer.html',
  '/css/home.css',
  '/css/loader.css',
  '/js/script.js',
  '/js/lottie.js',
  '/Animation - 1737890084161.json',
  '/Logo.png',
  '/logo.jpg',
];

// Install event: Caches essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential files...');
      return cache.addAll(FILES_TO_CACHE); // Cache HTML, CSS, JS files
    })
  );
  self.skipWaiting(); // Activate the service worker as soon as it's installed
});

// Activate event: Deletes old caches when a new version is activated
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          // Delete old caches that do not match the new cache version
          if (!cache.includes(CACHE_VERSION)) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of the clients (open pages)
});

// Fetch event: Handles requests and cache updates
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  // Check if the request is for an external image (not from the local domain)
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg|js)$/) && requestUrl.origin !== location.origin) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // If the image is already cached, return it
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise, fetch the image from the network and cache it
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone()); // Cache the fetched image
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle navigation requests (e.g., clicking a link)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log('No internet, showing offline page...');
        return caches.match(OFFLINE_URL); // Fallback to offline page
      })
    );
    return;
  }

  // Cache other requests (for uncached files and offline fallback)
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(() => {
        if (requestUrl.origin === location.origin) {
          return caches.match(OFFLINE_URL); // Fallback to offline page
        }
      });
    })
  );
});

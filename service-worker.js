// Set cache version for your app
const CACHE_VERSION = 'V7'; // Increment this version when making changes
const CACHE_NAME = `priflix-cache-${CACHE_VERSION}`;
const OFFLINE_URL = '/offline.html';

// Files to cache (HTML, CSS, JS)
const FILES_TO_CACHE = [ 
  '/index.html',
  '/offline.html',
  '/footer.html',
  '/header.html',
  '/content-page.html',
  '/css/home.css',
  '/css/loader.css',
  "/css/content-page.css",
  '/js/script.js',
  '/js/lottie.js',
  '/Animation - 1737890084161.json',
  '/Logo.png',
  '/logo.jpg',
];

// Install event: Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Caching essential files...');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // Activate the service worker immediately
});

// Activate event: Delete old caches and force reload
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );

  // Notify clients to reload
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});

// Fetch event: Serve from cache and update if needed
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log('No internet, showing offline page...');
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// Unregister old service workers
navigator.serviceWorker.getRegistrations().then((registrations) => {
  for (let reg of registrations) {
    reg.unregister();
  }
});

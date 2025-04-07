// Set cache version for your app
const CACHE_VERSION = 'V8'; // Increment this version when making changes
const CACHE_NAME = `priflix-cache-${CACHE_VERSION}`;


// Files to cache (HTML, CSS, JS)
const FILES_TO_CACHE = [
 
  '/index.html',
  '/login.html',
  '/styles.css',
  '/app.js',
  '/config.js',
  '/content-data.js',
  '/logo.png',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
];

// Install event: Cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files...');
        return cache.addAll(FILES_TO_CACHE);
      })
      .catch((error) => {
        console.error('Failed to cache essential files:', error);
      })
  );
  // Activate the service worker immediately after installation
  self.skipWaiting();
});

// Activate event: Delete old caches and take control of clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== CACHE_NAME) {
              console.log('Deleting old cache:', cache);
              return caches.delete(cache);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );

  // Optionally, reload all open client pages to update them immediately.
  self.clients.matchAll({ type: 'window' }).then((clients) => {
    clients.forEach((client) => client.navigate(client.url));
  });
});

// Fetch event: Serve requests from cache, and update cache when possible
self.addEventListener('fetch', (event) => {
  // Only handle GET requests in the service worker cache logic.
  if (event.request.method !== 'GET') {
    return;
  }

  // For navigation requests (i.e. full page loads), try network first,
  // falling back to the offline page if necessary.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          console.log('No internet connection, serving offline page.');
          return caches.match(OFFLINE_URL);
        })
    );
    return;
  }

  // For other requests, try to serve from the cache first.
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If a cached response is found, return it and update the cache in the background.
        if (cachedResponse) {
          event.waitUntil(
            fetch(event.request)
              .then((networkResponse) => {
                // Only update cache if we get a successful response.
                if (networkResponse && networkResponse.status === 200) {
                  return caches.open(CACHE_NAME)
                    .then((cache) => cache.put(event.request, networkResponse.clone()));
                }
              })
              .catch((error) => {
                console.error('Background update failed:', error);
              })
          );
          return cachedResponse;
        }

        // If no cached response, fetch from network and cache the response.
        return fetch(event.request)
          .then((networkResponse) => {
            // Only cache valid responses.
            if (networkResponse && networkResponse.status === 200) {
              return caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                  return networkResponse;
                });
            }
            return networkResponse;
          })
          .catch(() => {
            // Optionally, you can provide a fallback for non-navigation requests.
            // For example, you might return a default image for image requests.
          });
      })
  );
});

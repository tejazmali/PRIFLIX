const CACHE_NAME = "priflix-cache-v1";
const OFFLINE_URL = "/offline.html";

// Files to cache (HTML, CSS, JS for offline page)
const FILES_TO_CACHE = [
  "/offline.html",
  "/css/content-page.css",
  "/css/loader.css",
  "/logo.jpg",  // Favicon
  "/js/script.js",
  "/js/content-page.js",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",  // Font Awesome CDN
  "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js",  // Lottie player CDN
  "https://unpkg.com/@dotlottie/player-component@2.7.12/dist/dotlottie-player.mjs" // Lottie player module
];

// Install event: Cache offline page and its resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential files for offline...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate event: Remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log("Deleting old cache:", cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: Serve cached resources or offline page when needed
self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // If the user is requesting the offline.html page, serve it from the cache
  if (event.request.url.includes(OFFLINE_URL)) {
    event.respondWith(
      caches.match(OFFLINE_URL).then((cachedResponse) => {
        return cachedResponse || fetch(OFFLINE_URL); // Serve from cache or fetch if not cached
      })
    );
    return;
  }

  // If the request is for a resource (CSS, JS, images, etc.)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If the resource is cached, serve it
      if (cachedResponse) {
        return cachedResponse;
      }

      // Otherwise, fetch the resource from the network
      return fetch(event.request).catch(() => {
        // If the network is not available, serve the offline page
        if (event.request.mode === "navigate") {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

const CACHE_NAME = "priflix-cache-v1";
const OFFLINE_URL = "/offline.html";

// Files to cache (HTML, CSS, JS)
const FILES_TO_CACHE = [
  "/index.html",
  "/offline.html",
  "/header.html",
  "/footer.html",
  "/css/home.css",
  "/css/loader.css",
  "/css/content-page.css",
  "/js/pwa-app request.js",
  "/js/script.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

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

self.addEventListener("fetch", (event) => {
  const requestUrl = new URL(event.request.url);

  // Handle navigation requests (e.g., clicking a link)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        console.log("No internet, showing offline page...");
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Cache all image files (if not already cached)
  if (event.request.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
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
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

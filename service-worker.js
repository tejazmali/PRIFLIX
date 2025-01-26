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

// List of images to cache from the provided data
const IMAGES_TO_CACHE = [
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FAgaD7s1vgIf4Soi3flAKN6Bte6u.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2F19REaSRoNcO0KgMmrGUWtfpRKZY.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fynow2o9v0G341PLv1chCRDufCgc.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsfbSjGlLHsvFQrMUSNR9RrwZgV1.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FtCZFfYTIwrR7n94J6G14Y4hAFU6.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FnfpPzlKiqkIGpI8HXpsrU6vnNdp.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsXZhtWLo3fecavpDuOyJiayjt32.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2Fe%2Fgracenote%2Fe24be4e62720ebe500a7e7a3cf1a65cf.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fmetadata-static.plex.tv%2F1%2Fgracenote%2F1fe9f7ac98263ff48063ed05767ac60e.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FsGwYqVqheXuevFOBC0BFhFvDU9T.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2Fs3ZAS0AGLQ668sFveVFinAd2zVy.jpg",
  "https://images.plex.tv/photo?size=medium-360&scale=1&url=https%3A%2F%2Fimage.tmdb.org%2Ft%2Fp%2Foriginal%2FfiimZ9Xt5cPTPHNrbS4QautBXpU.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching essential files and images...");
      return cache.addAll(FILES_TO_CACHE.concat(IMAGES_TO_CACHE)); // Cache HTML, CSS, JS files and images
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

  // Cache image files if not already cached
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

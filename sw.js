const CACHE = "price-list-sales-calculator-v9-5";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-512.png"];

self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key)))));
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  var isAppShellDoc = event.request.mode === "navigate" ||
    event.request.url.endsWith("/index.html") ||
    event.request.url.endsWith("/");

  if (isAppShellDoc) {
    // Network-first for the app itself: always try to fetch the latest
    // version first, and only fall back to the cached copy when offline.
    // A cache-first strategy here was why updates could get stuck behind
    // an old cached copy indefinitely.
    event.respondWith(
      fetch(event.request).then(function (response) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
        return response;
      }).catch(function () {
        return caches.match(event.request);
      })
    );
    return;
  }

  // Icons/manifest change rarely, so cache-first is fine for those.
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});

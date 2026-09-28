const CACHE = "price-list-sales-calculator-v9-6";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-512.png","./fonts/poppins-latin-400-normal.woff2","./fonts/poppins-latin-500-normal.woff2","./fonts/poppins-latin-600-normal.woff2","./fonts/poppins-latin-700-normal.woff2","./fonts/poppins-latin-800-normal.woff2","./fonts/poppins-latin-900-normal.woff2"];

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
    // Stale-while-revalidate: open instantly from the cached copy (important
    // on slow networks) and fetch the latest version quietly in the background.
    // A new version is used the next time the app is opened.
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
        var refresh = fetch(event.request).then(function (response) {
          if (response && response.ok) {
            var copy = response.clone();
            caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
          }
          return response;
        }).catch(function () { return cached; });
        event.waitUntil(refresh.catch(function () {}));
        return cached || refresh;
      })
    );
    return;
  }

  // Icons/manifest change rarely, so cache-first is fine for those.
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});

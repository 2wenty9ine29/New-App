const CACHE = "price-list-sales-calculator-v9-74";
const APP_SHELL = ["./","./index.html","./manifest.webmanifest","./icon-180.png","./icon-512.png","./fonts/poppins-latin-400-normal.woff2","./fonts/poppins-latin-500-normal.woff2","./fonts/poppins-latin-600-normal.woff2","./fonts/poppins-latin-700-normal.woff2"];

self.addEventListener("install", event => {
  // Always fetch fresh copies (bypass the browser's HTTP cache) so a new
  // version can never install an old page. Fonts are best-effort so one
  // missing font can't stop an update from installing.
  event.waitUntil(caches.open(CACHE).then(cache => Promise.all(APP_SHELL.map(url =>
    fetch(new Request(url, { cache: "reload" })).then(res => {
      if (!res.ok) throw new Error(url + " " + res.status);
      return cache.put(url, res);
    }).catch(err => { if (url.indexOf("/fonts/") === -1) throw err; })
  ))));
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
    // Open instantly from the cached copy. Only re-download the page in the
    // background if the saved copy is older than 6 hours, so launches on slow
    // networks aren't competing with a full page download every time.
    // New versions still arrive quickly: a new sw.js installs a fresh copy.
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then(function (cached) {
        var stale = true;
        if (cached) {
          var d = Date.parse(cached.headers.get("date") || "");
          stale = !d || (Date.now() - d) > 6 * 60 * 60 * 1000;
        }
        if (cached && !stale) return cached;
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

  // Fonts, icons and manifest change rarely: cache-first, and remember any
  // font (e.g. Poppins 800/900) the first time it is used.
  event.respondWith(caches.match(event.request).then(function (cached) {
    if (cached) return cached;
    return fetch(event.request).then(function (response) {
      if (response && response.ok && event.request.url.indexOf("/fonts/") !== -1) {
        var copy = response.clone();
        caches.open(CACHE).then(function (cache) { cache.put(event.request, copy); });
      }
      return response;
    });
  }));
});

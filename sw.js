var CACHE = "seow-loading-v1.0.1";

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE).then(function (cache) {
      return cache.addAll(["bg.png", "css/loading.css", "index.html"]);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key === CACHE) return null;
        return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

self.addEventListener("fetch", function (event) {
  var request = event.request;
  if (request.method !== "GET") return;

  var url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.headers.get("range")) return;
  if (/\.(mp4|webm|ogv)$/i.test(url.pathname)) return;
  if (url.pathname.slice(-12) === "version.json") return;

  event.respondWith(
    caches.open(CACHE).then(function (cache) {
      return cache.match(request).then(function (cached) {
        var network = fetch(request).then(function (response) {
          if (response && response.status === 200) cache.put(request, response.clone());
          return response;
        }).catch(function () {
          return cached;
        });
        return cached || network;
      });
    })
  );
});

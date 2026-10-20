// Bộ nhớ đệm để app mở được khi không có mạng.
// Đổi VERSION mỗi lần cập nhật app để điện thoại tải bản mới.
var VERSION = "so-tap-v1";
var SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/apple-touch-icon.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

// Trả bản trong bộ nhớ đệm ngay, đồng thời tải bản mới ở nền cho lần mở sau.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return;

  e.respondWith(
    caches.open(VERSION).then(function (cache) {
      return cache.match(req, { ignoreSearch: sameOrigin }).then(function (hit) {
        var fresh = fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        }).catch(function () {
          if (req.mode === "navigate") return cache.match("./index.html");
          return hit;
        });
        return hit || fresh;
      });
    })
  );
});

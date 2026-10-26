// Bộ nhớ đệm để app mở được khi không có mạng.
// Đổi VERSION mỗi lần cập nhật app để điện thoại tải bản mới.
var VERSION = "fitcore-v18";
var SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./db.js",
  "./du-lieu.html",
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

// File của app: lấy bản mới trên mạng trước (chờ tối đa 3 giây), mất mạng thì dùng bản đã lưu.
// Font: dùng bản đã lưu trước vì không đổi.
self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  var sameOrigin = url.origin === self.location.origin;
  var isFont = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!sameOrigin && !isFont) return;

  e.respondWith(
    caches.open(VERSION).then(function (cache) {
      var fromCache = function () {
        return cache.match(req, { ignoreSearch: sameOrigin }).then(function (hit) {
          return hit || (req.mode === "navigate" ? cache.match("./index.html") : undefined);
        });
      };
      var fromNet = function () {
        return fetch(req).then(function (res) {
          if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone());
          return res;
        });
      };
      if (isFont) return fromCache().then(function (hit) { return hit || fromNet(); });
      return new Promise(function (resolve) {
        var settled = false;
        var timer = setTimeout(function () {
          fromCache().then(function (hit) { if (hit && !settled) { settled = true; resolve(hit); } });
        }, 3000);
        fromNet().then(function (res) {
          clearTimeout(timer);
          if (!settled) { settled = true; resolve(res); }
        }).catch(function () {
          clearTimeout(timer);
          fromCache().then(function (hit) { if (!settled) { settled = true; resolve(hit || Response.error()); } });
        });
      });
    })
  );
});

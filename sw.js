"use strict";

// Network first: online users always get the newest files; the cache is only an offline fallback.
// CACHE_VERSION only needs a bump when APP_SHELL changes.
const CACHE_VERSION = "wordol-v21";
const APP_SHELL = [
  "./", "index.html", "styles.css", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png",
  "js/data.js", "js/emoji.js", "js/art.js", "js/sentences.js", "js/path-young.js", "js/path-mid.js", "js/path-upper.js",
  "js/dictionary.js", "js/ocr.js", "js/core.js", "js/rychu.js", "js/modes.js", "js/learn.js", "js/audio.js", "js/support.js", "js/jokes.js", "js/riddles.js", "js/games.js", "js/shop.js", "js/views.js",
  "js/addwords.js", "js/app.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_VERSION).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_VERSION).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

// Same-origin files: network first (bypassing the HTTP cache), saved for offline use; cache only when offline.
// External services (dictionary, OCR CDN) go straight to the network.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(
    fetch(event.request, { cache: "no-cache" })
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => caches.match(event.request, { ignoreSearch: true })
        .then((cached) => cached || (event.request.mode === "navigate" ? caches.match("index.html") : Response.error())))
  );
});

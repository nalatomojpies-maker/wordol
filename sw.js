"use strict";

// Bump CACHE_VERSION after every deployment so users get the new files.
const CACHE_VERSION = "wordol-v5";
const APP_SHELL = [
  "./", "index.html", "styles.css", "manifest.webmanifest", "icon.svg",
  "js/data.js", "js/emoji.js", "js/art.js", "js/sentences.js", "js/path-young.js", "js/path-mid.js", "js/path-upper.js",
  "js/dictionary.js", "js/ocr.js", "js/core.js", "js/rychu.js", "js/modes.js", "js/learn.js", "js/audio.js", "js/views.js",
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

// Same-origin files: cache first. External services (dictionary, OCR CDN) go straight to the network.
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) return;
  event.respondWith(caches.match(event.request).then((cached) => cached || fetch(event.request)));
});

// CACHE PERSONAL (Opcional)
const CACHE_NAME = "rock-cache-v3";
const ASSETS = [
    "/sw/",
    "/css/styles.css",
    "/img/favicon-192.png",
    "/img/favicon-96.png",
];

// INSTALL
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
            .catch((err) => console.warn("Error cache:", err))
    );
});

// ACTIVATE
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME)
                    .map((k) => caches.delete(k))
            )
        )
    );
});

// FETCH — solo maneja su propio scope
self.addEventListener("fetch", (event) => {
    if (!event.request.url.includes("/sw/")) {
        return; // NO interceptar recursos globales
    }

    event.respondWith(
        caches.match(event.request).then((cached) => cached || fetch(event.request))
    );
});

const CACHE_NAME = "rock-app-v1";

const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/css/style.css",
    "/main.js",
    "/js/formulario.js",
    "/js/firebase.js",
    "/img/favicon-192.png",
    "/img/favicon-512.png"
];

const ONESIGNAL_IGNORE = [
    "/OneSignalSDKWorker.js",
    "/OneSignalSDKUpdaterWorker.js",
    "https://cdn.onesignal.com"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
    );
    self.skipWaiting();
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener("fetch", (event) => {

    const url = event.request.url;
    if (ONESIGNAL_IGNORE.some(path => url.includes(path))) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then(resp =>
            resp || fetch(event.request)
        )
    );
});

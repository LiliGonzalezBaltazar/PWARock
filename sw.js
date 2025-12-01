// Nombre y versión del caché
const CACHE_NAME = 'v1_cache_LilianaGonzalezPWA';

// Archivos a cachear
const urlsToCache = [
    './',
    './css/styles.css',
    './img/favicon.png',
    './img/rock1.png',
    './img/rock2.png', 
    './img/rock3.png',
    './img/facebook.png',
    './img/instagram.png',
    './img/twitter.png',
    './img/favicon-1024.png',
    './img/favicon-512.png',
    './img/favicon-384.png',
    './img/favicon-256.png',
    './img/favicon-192.png',
    './img/favicon-128.png',
    './img/favicon-96.png',
    './img/favicon-64.png',
    './img/favicon-32.png',
    './img/favicon-16.png'
];

// INSTALACIÓN
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
        .catch(err => console.log('Fallo cache:', err))
    );
});

// ACTIVACIÓN
self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];

    e.waitUntil(
        caches.keys()
        .then(names => 
            Promise.all(
                names.map(name => {
                    if (!cacheWhitelist.includes(name)) {
                        return caches.delete(name);
                    }
                })
            )
        )
        .then(() => self.clients.claim())
    );
});

// FETCH
self.addEventListener('fetch', e => {
    e.respondWith(
       caches.match(e.request)
        .then(res => res || fetch(e.request))
    );
});

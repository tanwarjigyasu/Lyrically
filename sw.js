const offlineCache = "offline";
const offlineCacheFiles = [
    './',
    'https://cdn.jsdelivr.net/npm/@pwabuilder/pwainstall@latest/dist/pwa-install.min.js',
    'https://cdn.jsdelivr.net/gh/AssassinAguilar/Alertism/dist/V2.0.0/main.js',
    'index.html',
    './dist/main.css',
    './dist/script.js',
    './assets/icon.png',
    './assets/icon_maskable.png',
    './assets/background.png'
];

self.addEventListener("install", function (e) {
    e.waitUntil(
        (async () => {
            const cache = await caches.open(offlineCache);
            await cache.addAll(offlineCacheFiles);
        })()
    );
    self.skipWaiting();
});

self.addEventListener("fetch", function (e) {
    e.respondWith(
        (async () => {
            const r = await caches.match(e.request);
            if (r) {
                return r;
            }
            const response = await fetch(e.request);
            const cache = await caches.open(cacheName);
            cache.put(e.request, response.clone());
            return response;
        })()
    );
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key === offlineCache) {
                        return;
                    }
                    return caches.delete(key);
                })
            );
        })
    );
});
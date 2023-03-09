self.skipWaiting();
self.addEventListener("install", function (e) {
    return e.addAll([
        './',
        'https://cdn.jsdelivr.net/npm/@pwabuilder/pwainstall@latest/dist/pwa-install.min.js',
        'index.html',
        './dist/main.css',
        './dist/script.js',
        './assets/icon.png',
        './assets/icon_maskable.png',
        './assets/background.png',
    ]);
});

self.addEventListener("fetch", function (e) {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then(function (response) {
            return response || fetch(e.request);
        })
    );
});
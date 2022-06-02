if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/PWA-test/sw.js");
}


const urlsToCache = ["/PWA-test","style.css"];
self.addEventListener("install", (event) => {
   event.waitUntil(async () => {
      const cache = await caches.open("pwa-assets");
      console.log(cache,'cache')
      return cache.addAll(urlsToCache);
   });
   console.log('Service worker installed')
});

self.addEventListener("activate", event => {
    console.log("Service worker activated");
});

self.addEventListener("fetch", event => {
    cache.open('pwa-assets').then(cache =>
    event.respondWith(
        cache.match(event.request)
        .then(cachedResponse => cachedResponse || fetch(event.request))
        )
    )
});
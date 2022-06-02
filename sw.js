if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/serviceworker.js");
}


const urlsToCache = ["/"];
self.addEventListener("install", (event) => {
   event.waitUntil(async () => {
      const cache = await caches.open("pwa-assets");
      return cache.addAll(urlsToCache);
   });
   console.log('Service worker installed')
});

self.addEventListener("activate", event => {
    console.log("Service worker activated");
});


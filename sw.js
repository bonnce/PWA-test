if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/PWA-test/sw.js");
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

self.addEventListener("fetch", event => {
    const options = {
        status: 200,
        headers: {
            'Content-type': 'text/html'
        }
        };
    const htmlResponse = new Response(`<b>This is a response for the already sw installed</b> content
    directly from ${event.request.url}`,
    options)
    event.respondWith(htmlResponse)
});
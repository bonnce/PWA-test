if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register("/PWA-test/sw.js");
}


const urlsToCache = ["/PWA-test","style.css","darkhole.jpg"];
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("pwa-assets")
        .then(cache => {
           return cache.addAll(urlsToCache);
        })
    )
   console.log('Service worker installed')
});

self.addEventListener("activate", event => {
    console.log("Service worker activated");
});

self.addEventListener("fetch", event => {
    const matchRequest = event.request.url.substring(/^https.+\.io\//)[0]
    console.log(matchRequest)
    event.respondWith(
      caches.match(matchRequest).then(cachedResponse => {
          const networkFetch = fetch(event.request).then(response => {
            // update the cache with a clone of the network response
            caches.open("pwa-assets").then(cache => {
                cache.put(event.request, response.clone());
            });
          });
          // prioritize cached response over network
          return cachedResponse || networkFetch;
      }
    )
   )
 });

 
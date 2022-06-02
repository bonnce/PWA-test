const urlsToCache = ["/PWA-test/","style.css","darkhole.jpg",'app.js'];
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
    console.log('event',event.request.url)
    console.log('caches',caches)
    caches.open('pwa-assets').then(cache=>{
        console.log('cache',cache)
        cache.match(event.request).then(response =>{
            console.log('response cache',response)
        })
    })
    caches.match(event.request.url).then(response=>{
        console.log('response caches',response)
    })
    fetch(event.request).then(response=>{
        console.log('fetch response',response)
    })
//     event.respondWith(
//       caches.match(matchRequest).then(cachedResponse => {
//           const networkFetch = fetch(event.request).then(response => {
//             // update the cache with a clone of the network response
//             caches.open("pwa-assets").then(cache => {
//                 cache.put(event.request, response.clone());
//             });
//             console.log(response.clone())
//           });
//           // prioritize cached response over network
//           return cachedResponse || networkFetch;
//       }
//     )
//    )
 });

 
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
    console.log('caches',caches)
    caches.open('pwa-assets').then(cache=>{
        console.log('cache',cache)
        cache.match(event.request).then(response =>{
            console.log('response cache',response)
        })
    })
    caches.match(event.request).then(response=>{
        console.log('response caches',response)
    })

    const options ={
        ignoreSearch:true,
        ignoreMethod:true,
        ignoreVary:true,
    }
    caches.open('pwa-assets').then(cache=>{
        console.log('cache',cache)
        cache.match(event.request,options).then(response =>{
            console.log('response cache with options',response)
        })
    })
    caches.match(event.request,options).then(response=>{
        console.log('response caches with options',response)
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

 
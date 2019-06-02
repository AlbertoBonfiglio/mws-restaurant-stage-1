const CACHE_VERSION = 'app-v3';
const cachedURLS = [
  '/index.html',
  '/restaurant.html',
  '/data/',
  '/css/',
  '/img/',
  '/js/',
  'sw.js'
];

self.addEventListener('install', function(event) {
    console.log("SW installing");
    event.waitUntil(
      caches.open(CACHE_VERSION)
        .then(function(cache) {
          console.log("SW installed");
          console.log('SW cache is open');
          return cache.addAll(cachedURLS);
      })
    );
  });

self.addEventListener('activate', function (event) {
  console.log("SW activated");
  event.waitUntil(
      caches.keys().then(function(keys){
          return Promise.all(keys.map(function(key, i){
              if(key !== CACHE_VERSION){
                  console.log('Deleting cache: ', keys[i]); 
                  return caches.delete(keys[i]);
              }
          }))
      })
  )
});

self.addEventListener('fetch', function(event) {
  console.log("SW fetch detected");
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_VERSION)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});




/*
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(resp) {
      return resp || fetch(event.request).then(function(response) {
        return caches.open('v1').then(function(cache) {
          cache.put(event.request, response.clone());
          return response;
        });  
      });
    })
  );
});
*/
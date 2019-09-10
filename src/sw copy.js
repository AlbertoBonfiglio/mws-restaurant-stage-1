importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

import { openDB, deleteDB, wrap, unwrap } from 'idb';

const CACHE_VERSION = 'app-v3';
const cachedURLS = [
  '/index.html',
  '/restaurant.html',
  //'/data/',
  '/css/',
  '/img/',
  '/js/',
  'sw.bundle.js'
];

workbox.routing.registerRoute(
  /\.(?:js|css)$/,
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: 'static-resources'
  })
);

workbox.routing.registerRoute(
  // Cache image files.
  /\.(?:png|jpg|jpeg|svg|gif)$/,
    // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images.
        maxEntries: 20,
        // Cache for a maximum of a week.
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

const matchCb = ({url, event}) => {
  return (url.pathname === '/restaurants');
};

const handlerCb = ({url, event, params}) => {
  return fetch(event.request)
  .then((response) => {
    trest(response.clone());
    return response;
    //let y = new Response();
    //y.status = 666;
    //y.statusText = 'suca';
    //return y;
  })
  .catch(err => {
    //let { query, variables } = parseQueryString(url.search);
    console.log(err);
    // read data from indexed db here

  });
};
workbox.routing.registerRoute(matchCb, handlerCb);

function trest(res){
  res.then(res => res.json())
     .then(res2 => console.log('trest', res2) );
}

/*

self.addEventListener('install', function(event) {
    console.log("SW installing");
    test();
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
  db = initializeDb();
  event.waitUntil(
      caches.keys()
        .then(function(keys) {
          return Promise
            .all(keys.map(function(key, i) {
              if(key !== CACHE_VERSION){
                  console.log('Deleting cache: ', keys[i]); 
                  return caches.delete(keys[i]);
              }}
            ))}));
});

self.addEventListener('fetch', function(event) {
  console.log("SW fetch detected");
  test();
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

*/

// https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076
//https://www.codeproject.com/Articles/671294/Using-HTML5-IndexedDB-as-a-Client-Data-Store
const keyval = 'restaurants';
const oldVersion = 1;
const newVersion = 1;

let db = initializeDb();

function initializeDb(){
  console.log('Database Initialization');
  return openDB('rrw_db', 1, {
    upgrade(db, oldVersion, newVersion) {
      db.createObjectStore(keyval);
    }
  });
}

function test(){
  db.then(db => {
    const store = db.transaction(keyval, 'readwrite').objectStore(keyval);
    store.put('grosse', 'tette')
      .then(
          res => console.log(res)
      )   
      .catch(
          error => console.error(error)
      );
  })
  .catch(err => console.log(err));  

}

// https://developers.google.com/web/ilt/pwa/live-data-in-the-service-worker

function getStoreData() { 
  db.then(db => {
    const store = db.transaction(keyval, 'readwrite').objectStore(keyval);
    store.put('grosse', 'tette')
      .then(
          res => console.log(res)
      )   
      .catch(
          error => console.error(error)
      );
  })
  .catch(err => console.log(err));  
}

function putDataInStore() {
  db.then(db => {
    const store = db.transaction(keyval, 'readwrite').objectStore(keyval);
    store.put('grosse', 'tette')
      .then(
          res => console.log(res)
      )   
      .catch(
          error => console.error(error)
      );
  })
  .catch(err => console.log(err));  
}
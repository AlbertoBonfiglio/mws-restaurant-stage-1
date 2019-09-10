importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
import { openDB, deleteDB, wrap, unwrap } from 'idb';

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([
  {
    "url": "css/details.css",
    "revision": "92a8bfa5d0b04b7fcb891047679d502d"
  },
  {
    "url": "css/filter.css",
    "revision": "07194529ecc24704fb0d64bb1bd2d8b1"
  },
  {
    "url": "css/listing.css",
    "revision": "b81eec8d5ae7005838a6d72d20f1a673"
  },
  {
    "url": "css/map.css",
    "revision": "e5472fa162c1ec0fcb64ea734a89352d"
  },
  {
    "url": "css/nav.css",
    "revision": "2c3285a79658dee295fb43e6aac81df1"
  },
  {
    "url": "css/styles.css",
    "revision": "3e1e58cf8d6beebc392c970433dd718d"
  },
  {
    "url": "index.html",
    "revision": "6bd43a78e21fe5b39ad91e1f02552bde"
  },
  {
    "url": "js/bootstrap.js",
    "revision": "96f3585be7e8fd8a85e696813bd38b6a"
  },
  {
    "url": "js/dbhelper.js",
    "revision": "f361fc727cf3e53a32bb6bc62880772d"
  },
  {
    "url": "js/main.js",
    "revision": "bb9119bcb6e4625bca51501d77438432"
  },
  {
    "url": "js/mapHelper.js",
    "revision": "b5baf67229be4420d957c37224f716f5"
  },
  {
    "url": "js/restaurant_info.js",
    "revision": "8c842159314570c959f5a02593252616"
  },
  {
    "url": "restaurant.html",
    "revision": "0ea0420970db15edd5fde7fdb6b8a6b0"
  },
  {
    "url": "src/sw copy.js",
    "revision": "1ca28a274e232b94301768a824d4fd17"
  },
  {
    "url": "sw.bundle.js",
    "revision": "ea4bc2ec804dc845d3aedfb17dce5c0a"
  }
]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

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
// https://itnext.io/indexeddb-your-second-step-towards-progressive-web-apps-pwa-dcbcd6cc2076
//https://www.codeproject.com/Articles/671294/Using-HTML5-IndexedDB-as-a-Client-Data-Store

/* indexed Db wraper */
const keyval = 'restaurants';
const oldVersion = 1;
const newVersion = 1;

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

let db = initializeDb();
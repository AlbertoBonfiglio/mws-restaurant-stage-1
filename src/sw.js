importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');
import { openDB, deleteDB, wrap, unwrap } from 'idb';

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  workbox.precaching.precacheAndRoute([]);
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
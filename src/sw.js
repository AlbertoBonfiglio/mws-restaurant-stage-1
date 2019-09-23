importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  // workbox.core.skipWaiting();
  //  workbox.core.clientsClaim();
  workbox.precaching.precacheAndRoute([]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

// Cache image files.
workbox.routing.registerRoute(
  /\.(?:png|gif|jpg|jpeg|webp|svg)$/,
  // Use the cache if it's available.
  new workbox.strategies.CacheFirst({
    // Use a custom cache name.
    cacheName: 'images-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache for a maximum of a week.
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);

// Caches api calls
const matchAPI = ({url, event }) => {
    const match = new RegExp(".+\/restaurants.*");  // <-- matches any origin
    const matches = match.test(url.href);
    return matches;
};

workbox.routing.registerRoute(
  matchAPI,
  new workbox.strategies.CacheFirst({
    cacheName: 'data-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache for a maximum of a week.
        maxEntries: 1000,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  })
);

// Caches POST calls
const matchPOST = ({url, event }) => {
  const match = new RegExp(".+\/reviews.*");  // <-- matches any origin
  const matches = match.test(url.href);
  return matches;
};

const bgSyncPlugin = new workbox.backgroundSync.Plugin('POST-cache-queue', {
  maxRetentionTime: 24 * 60 // Retry for max of 24 Hours (specified in minutes)
});

workbox.routing.registerRoute(
  matchPOST,
  new workbox.strategies.NetworkOnly({
    plugins: [bgSyncPlugin] 
  }),
  'POST'
);


// Caches PAGE calls
const matchPage = ({url, event }) => {
  const match = new RegExp(".+html*");  // <-- matches any origin
  const matches = match.test(url.href);
  return matches;
};

// Caches Pages calls
workbox.routing.registerRoute(
  matchPage,
  new workbox.strategies.CacheFirst({
    cacheName: 'page-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache for a maximum of a week.
        maxEntries: 1000,
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ]
  })
);

/*
// backgroundsync 
const queue = new workbox.backgroundSync.Queue('myQueueName');

self.addEventListener('fetch', (event) => {
  // Clone the request to ensure it's safe to read when
  // adding to the Queue.
  console.log('Cloning request');
  const promiseChain = fetch(event.request.clone())
  .catch((err) => {
      console.log('Pushing request');
      return queue.pushRequest({request: event.request});
  });

  event.waitUntil(promiseChain);
});
*/
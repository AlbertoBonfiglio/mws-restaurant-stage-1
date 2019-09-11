importScripts('https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js');

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);
  // workbox.core.skipWaiting();
  //  workbox.core.clientsClaim();
  workbox.precaching.precacheAndRoute([]);
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

workbox.routing.registerRoute(
  // Cache image files.
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
}

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



const matchPage = ({url, event }) => {
  const match = new RegExp(".+html*");  // <-- matches any origin
  const matches = match.test(url.href);
  return matches;
}

// Caches api calls
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


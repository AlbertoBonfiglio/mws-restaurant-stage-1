!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var o in e)n.d(r,o,function(t){return e[t]}.bind(null,o));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){var r;!function e(t,n,o){function a(i,c){if(!n[i]){if(!t[i]){if(!c&&"function"==typeof r&&r)return r(i,!0);if(s)return s(i,!0);var u=new Error("Cannot find module '"+i+"'");throw u.code="MODULE_NOT_FOUND",u}var d=n[i]={exports:{}};t[i][0].call(d.exports,(function(e){return a(t[i][1][e]||e)}),d,d.exports,e,t,n,o)}return n[i].exports}for(var s="function"==typeof r&&r,i=0;i<o.length;i++)a(o[i]);return a}({1:[function(e,t,n){"use strict";const r=(e,t)=>t.some(t=>e instanceof t);let o,a;const s=new WeakMap,i=new WeakMap,c=new WeakMap,u=new WeakMap,d=new WeakMap;let f={get(e,t,n){if(e instanceof IDBTransaction){if("done"===t)return i.get(e);if("objectStoreNames"===t)return e.objectStoreNames||c.get(e);if("store"===t)return n.objectStoreNames[1]?void 0:n.objectStore(n.objectStoreNames[0])}return g(e[t])},has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function l(e){return e!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(a||(a=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(e)?function(...t){return e.apply(b(this),t),g(s.get(this))}:function(...t){return g(e.apply(b(this),t))}:function(t,...n){const r=e.call(b(this),t,...n);return c.set(r,t.sort?t.sort():[t]),g(r)}}function p(e){return"function"==typeof e?l(e):(e instanceof IDBTransaction&&function(e){if(i.has(e))return;const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("complete",o),e.removeEventListener("error",a),e.removeEventListener("abort",a)},o=()=>{t(),r()},a=()=>{n(e.error),r()};e.addEventListener("complete",o),e.addEventListener("error",a),e.addEventListener("abort",a)});i.set(e,t)}(e),r(e,o||(o=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction]))?new Proxy(e,f):e)}function g(e){if(e instanceof IDBRequest)return function(e){const t=new Promise((t,n)=>{const r=()=>{e.removeEventListener("success",o),e.removeEventListener("error",a)},o=()=>{t(g(e.result)),r()},a=()=>{n(e.error),r()};e.addEventListener("success",o),e.addEventListener("error",a)});return t.then(t=>{t instanceof IDBCursor&&s.set(t,e)}).catch(()=>{}),d.set(t,e),t}(e);if(u.has(e))return u.get(e);const t=p(e);return t!==e&&(u.set(e,t),d.set(t,e)),t}const b=e=>d.get(e);n.wrap=g,n.addTraps=function(e){f=e(f)},n.instanceOfAny=r,n.reverseTransformCache=d,n.unwrap=b},{}],2:[function(e,t,n){"use strict";Object.defineProperty(n,"__esModule",{value:!0});var r=e("./chunk.js");const o=["get","getKey","getAll","getAllKeys","count"],a=["put","add","delete","clear"],s=new Map;function i(e,t){if(!(e instanceof IDBDatabase)||t in e||"string"!=typeof t)return;if(s.get(t))return s.get(t);const n=t.replace(/FromIndex$/,""),r=t!==n,i=a.includes(n);if(!(n in(r?IDBIndex:IDBObjectStore).prototype)||!i&&!o.includes(n))return;const c=async function(e,...t){const o=this.transaction(e,i?"readwrite":"readonly");let a=o.store;r&&(a=a.index(t.shift()));const s=a[n](...t);return i&&await o.done,s};return s.set(t,c),c}r.addTraps(e=>({get:(t,n,r)=>i(t,n)||e.get(t,n,r),has:(t,n)=>!!i(t,n)||e.has(t,n)})),n.unwrap=r.unwrap,n.wrap=r.wrap,n.openDB=function(e,t,{blocked:n,upgrade:o,blocking:a}={}){const s=indexedDB.open(e,t),i=r.wrap(s);return o&&s.addEventListener("upgradeneeded",e=>{o(r.wrap(s.result),e.oldVersion,e.newVersion,r.wrap(s.transaction))}),n&&s.addEventListener("blocked",()=>n()),a&&i.then(e=>e.addEventListener("versionchange",a)),i},n.deleteDB=function(e,{blocked:t}={}){const n=indexedDB.deleteDatabase(e);return t&&n.addEventListener("blocked",()=>t()),r.wrap(n).then(()=>void 0)}},{"./chunk.js":1}],3:[function(e,t,n){"use strict";var r=e("idb");importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"),workbox?(console.log("Yay! Workbox is loaded 🎉"),workbox.precaching.precacheAndRoute([])):console.log("Boo! Workbox didn't load 😬");workbox.routing.registerRoute(/\.(?:js|css)$/,new workbox.strategies.StaleWhileRevalidate({cacheName:"static-resources"})),workbox.routing.registerRoute(/\.(?:png|jpg|jpeg|svg|gif)$/,new workbox.strategies.CacheFirst({cacheName:"image-cache",plugins:[new workbox.expiration.Plugin({maxEntries:20,maxAgeSeconds:604800})]}));workbox.routing.registerRoute((function(e){var t=e.url;e.event;return"/restaurants"===t.pathname}),(function(e){var t=e.url,n=e.event;e.params;return fetch(n.request).then((function(e){return e.clone().then((function(e){return e.json()})).then((function(e){return console.log("trest",e)})),e})).catch((function(e){var n=parseQueryString(t.search),r=n.query;n.variables;console.log(r)}))}));var o="restaurants";console.log("Database Initialization"),(0,r.openDB)("rrw_db",1,{upgrade:function(e,t,n){e.createObjectStore(o)}})},{idb:2}]},{},[3])}]);
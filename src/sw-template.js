importScripts(
  'https://storage.googleapis.com/workbox-cdn/releases/4.2.0/workbox-sw.js'
);

if (workbox) {
  console.log(`Yay! Workbox is loaded 🎉`);

  /* injection point for manifest files.  */
  workbox.precaching.precacheAndRoute([]);

  workbox.routing.registerNavigationRoute('/');

  workbox.routing.registerRoute(
    new RegExp('/.(?:png|gif|jpg|jpeg)$/'),
    new workbox.strategies.CacheFirst({ cacheName: 'images' })
  );
} else {
  console.log(`Boo! Workbox didn't load 😬`);
}

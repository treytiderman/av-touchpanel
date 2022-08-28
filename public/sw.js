// Cache
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('cache').then(function(cache) {
      return cache.addAll([ './index.html' ]);
    })
   );
});

// Get cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request).catch(function() {
      return caches.match(event.request)
    })
  )
})
const CACHE_NAME = 'gunners-stats-v26.88.105';

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/site.webmanifest',
  '/Gunners_Stats.svg'
];

self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Mise en cache des fichiers de l\'application');
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activation...');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[Service Worker] Suppression de l'ancien cache', key);
          return caches.delete(key);
        }
      }));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
const CACHE_NAME = 'tajir-cache-v1';
const ASSETS = [
  '.',
  'index.html',
  'manifest.json'
  // إذا أضفت أيقونات أو ملفات أخرى أضفها هنا: 'icon-192.png', ...
];

self.addEventListener('install', ev=>{
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', ev=>{
  ev.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', ev=>{
  ev.respondWith(
    caches.match(ev.request).then(resp=>{
      return resp || fetch(ev.request).catch(()=>caches.match('index.html'));
    })
  );
});
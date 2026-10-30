/* Ma Bibliothèque V1.0.2 — offline-first app shell; user data stays in localStorage. */
const CACHE = 'ma-bibliotheque-v1-0-2-20261030';
const APP_SHELL = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg'];
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Cache the entry page under BOTH URLs; fail install if it cannot be cached.
    for (const path of APP_SHELL) {
      const response = await fetch(new Request(path, {cache:'reload'}));
      if (!response.ok || response.type === 'opaque') throw new Error('Precache failed: ' + path + ' ' + response.status);
      await cache.put(path, response);
    }
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    if (!await cache.match('/index.html')) throw new Error('Offline entry missing');
    const names = await caches.keys();
    await Promise.all(names.filter(n => n.startsWith('ma-bibliotheque-') && n !== CACHE).map(n => caches.delete(n)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE);
      // Always use cached app shell for navigations, including the installed PWA.
      const offlinePage = await cache.match('/index.html') || await cache.match('/');
      if (offlinePage) return offlinePage;
      try { return await fetch(req); } catch (e) {
        return new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Ma Bibliothèque</title><body><h1>Application indisponible hors connexion</h1><p>Reconnectez-vous une fois pour installer les fichiers hors ligne. Vos livres ne sont pas effacés.</p></body></html>', {status:503, headers:{'Content-Type':'text/html; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try { return await fetch(req); } catch (e) { return Response.error(); }
  })());
});

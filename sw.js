/* Ma Bibliothèque V2.0.0 — normalize redirect responses before caching. */
const CACHE = 'ma-bibliotheque-v2-0-0-final-20261031';
const APP_SHELL = ['/index.html', '/manifest.webmanifest', '/icon.svg'];

// A cached redirect response cannot be returned to a navigation whose redirect
// mode is "manual". Rebuild same-origin assets as ordinary 200 responses.
async function normalized(response, path) {
  if (!response.ok || response.type === 'opaque' || response.type === 'opaqueredirect') {
    throw new Error('Asset unavailable: ' + path + ' (' + response.status + ')');
  }
  if (new URL(response.url).origin !== self.location.origin) {
    throw new Error('Unexpected cross-origin redirect: ' + path);
  }
  const headers = new Headers(response.headers);
  headers.delete('location');
  headers.delete('content-length');
  return new Response(await response.blob(), {status: 200, statusText: 'OK', headers});
}

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    for (const path of APP_SHELL) {
      const response = await fetch(new Request(path, {cache: 'reload', redirect: 'follow'}));
      await cache.put(path, await normalized(response, path));
    }
    // Cache both canonical navigation paths with a non-redirected response.
    const entry = await cache.match('/index.html');
    await cache.put('/', entry.clone());
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    if (!await cache.match('/index.html')) throw new Error('Offline entry missing');
    // Delete only old caches of this app on this origin; localStorage is untouched.
    const names = await caches.keys();
    await Promise.all(names.filter(name => name.startsWith('ma-bibliotheque-') && name !== CACHE).map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const cache = await caches.open(CACHE);
        const page = await cache.match('/index.html');
        if (page) return page;
        const response = await fetch(request);
        return await normalized(response, request.url);
      } catch (error) {
        return new Response('<!doctype html><html lang="fr"><meta charset="utf-8"><title>Ma Bibliothèque</title><body><h1>Application indisponible</h1><p>Reconnectez-vous pour préparer le mode hors connexion. Vos livres ne sont pas effacés.</p></body></html>', {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8'}});
      }
    })());
    return;
  }
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try { return await fetch(request); } catch { return Response.error(); }
  })());
});

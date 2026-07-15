/* ============================================================
   SERVICE WORKER — PWA Offline Support
   Estrategia: cache-first con caché en tiempo de ejecución.
   Solo se precachean rutas que existen en producción (build de Vite).
   Los bundles con hash (assets/index-*.js/.css) se cachean al vuelo.
   ============================================================ */

const CACHE_NAME = 'un-ano-contigo-v5';

// Solo archivos con nombre ESTABLE (no los bundles con hash de Vite).
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json'
];

// Install: precachear el app shell de forma resiliente
// (un 404 individual no aborta toda la instalación).
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            Promise.allSettled(STATIC_ASSETS.map(url => cache.add(url)))
        )
    );
    self.skipWaiting();
});

// Activate: limpiar cachés viejas
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: cache-first, con caché en tiempo de ejecución para lo que falte
// (incluye los bundles con hash de Vite, que se guardan en el primer load).
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    e.respondWith(
        caches.match(e.request).then(cached => {
            if (cached) return cached;

            return fetch(e.request).then(response => {
                if (!response || response.status !== 200 || response.type === 'error') {
                    return response;
                }
                const copy = response.clone();
                caches.open(CACHE_NAME).then(cache => cache.put(e.request, copy));
                return response;
            }).catch(() => {
                // Sin red: para navegaciones, servir el shell
                if (e.request.mode === 'navigate') return caches.match('./index.html');
            });
        })
    );
});

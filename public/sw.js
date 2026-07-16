/* ============================================================
   SERVICE WORKER — PWA Offline Support
   Estrategia: cache-first con caché en tiempo de ejecución.
   Solo se precachean rutas que existen en producción (build de Vite).
   Los bundles con hash (assets/index-*.js/.css) se cachean al vuelo.
   ============================================================ */

const CACHE_NAME = 'un-ano-contigo-v7';

// Solo archivos con nombre ESTABLE (no los bundles con hash de Vite).
// Incluye fotos, posters y fuentes para que la experiencia offline
// esté completa (~1 MB total, se descarga una sola vez).
const STATIC_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    // Fuentes
    './fonts/cormorant-garamond-latin-400-normal.woff2',
    './fonts/cormorant-garamond-latin-500-normal.woff2',
    './fonts/cormorant-garamond-latin-600-normal.woff2',
    './fonts/cormorant-garamond-latin-400-italic.woff2',
    './fonts/cormorant-garamond-latin-500-italic.woff2',
    './fonts/inter-latin-300-normal.woff2',
    './fonts/inter-latin-400-normal.woff2',
    './fonts/inter-latin-500-normal.woff2',
    './fonts/inter-latin-600-normal.woff2',
    // Posters de los videos
    './assets/hero-poster.jpg',
    './assets/message-poster.jpg',
    './assets/cta-poster.jpg',
    // Galería (webp, lo que piden los navegadores modernos)
    './assets/1B4ED299-73D3-440E-B6CE-07CA598536BB_1_105_c.webp',
    './assets/1DDEEA17-9661-4E66-A144-544FE9B2EE1F_1_105_c.webp',
    './assets/387AE7EE-CD9C-4D67-8C7F-53235A1E9536_1_105_c.webp',
    './assets/3CC4B55C-E7AB-482E-BD1D-225C0694A19B_1_105_c.webp',
    './assets/6A610084-9BF4-4190-819F-235F23BA71E4_1_105_c.webp',
    './assets/8C608867-3085-47CA-B0F1-E7A589FDB036_1_105_c.webp',
    // Iconos
    './assets/favicon.svg',
    './assets/icon-192.png',
    './assets/icon-512.png'
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

// Fetch:
// - Navegaciones (HTML): network-first, así cada deploy se ve al instante;
//   la caché solo entra como respaldo sin conexión.
// - Assets: cache-first con caché en tiempo de ejecución
//   (incluye los bundles con hash de Vite, que se guardan en el primer load).
self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;

    if (e.request.mode === 'navigate') {
        e.respondWith(
            fetch(e.request).then(response => {
                if (response && response.status === 200) {
                    const copy = response.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
                }
                return response;
            }).catch(() =>
                caches.match(e.request).then(cached => cached || caches.match('./index.html'))
            )
        );
        return;
    }

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
            });
        })
    );
});

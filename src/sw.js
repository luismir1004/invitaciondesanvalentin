/* ============================================================
   SERVICE WORKER — generado con vite-plugin-pwa (injectManifest)

   El precache se inyecta en build con hashes automáticos:
   se acabaron los bumps manuales de versión de caché.
   ============================================================ */

import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { RangeRequestsPlugin } from 'workbox-range-requests';

self.skipWaiting();

// Migración: borrar las cachés del service worker artesanal anterior
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k.startsWith('un-ano-contigo-'))
                    .map((k) => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// Precache del app shell (HTML, CSS, JS, fuentes, fotos, posters, iconos)
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST);

// Navegaciones: network-first — cada deploy se ve al instante,
// la caché solo entra como respaldo sin conexión.
registerRoute(
    ({ request }) => request.mode === 'navigate',
    new NetworkFirst({ cacheName: 'pages' })
);

// Media pesada (videos y la canción): cache-first en runtime,
// con soporte de range requests (seeking de video/audio).
registerRoute(
    ({ url }) => /\.(mp4|mp3)$/.test(url.pathname),
    new CacheFirst({
        cacheName: 'media',
        plugins: [
            new CacheableResponsePlugin({ statuses: [200] }),
            new RangeRequestsPlugin()
        ]
    })
);

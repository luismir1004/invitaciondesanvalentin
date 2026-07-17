import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    build: {
        target: 'es2019',
        sourcemap: false
    },
    plugins: [
        VitePWA({
            strategies: 'injectManifest',
            srcDir: 'src',
            filename: 'sw.js',
            registerType: 'autoUpdate',
            injectRegister: 'script-defer',
            // El manifest.json existente en public/ se sirve tal cual
            manifest: false,
            injectManifest: {
                // Precache: shell + fuentes + fotos webp + posters + iconos.
                // Los .jpeg de la galería quedan fuera (los navegadores
                // modernos solo piden el webp) y los mp4/mp3 se cachean
                // en runtime al reproducirse.
                globPatterns: [
                    '**/*.{html,css,js,woff2,svg,png,webp,json}',
                    'assets/*poster*.jpg'
                ],
                maximumFileSizeToCacheInBytes: 3 * 1024 * 1024
            }
        })
    ]
});

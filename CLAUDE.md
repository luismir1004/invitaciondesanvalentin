# Notas para sesiones de Claude

Invitación de aniversario para Alejandra ("Ale") de parte de Luis.
La cena es el **20 de julio de 2026, 7 PM, Bonsai Sushi (Sambil Chacao, Caracas)**.
Comunicación con el usuario **en español**. Deploy: push a `main` → Vercel automático.

## Reglas del proyecto

- **`src/config.js` es la única fuente de verdad** de fechas/lugar/WhatsApp.
  Nunca hardcodear esos datos en otro archivo.
- **Assets con caché inmutable**: si cambias el contenido de un video/poster,
  **renombra el archivo** (por eso existen `hero-video-3`, `message-video-2`).
- **El hero no tiene texto HTML visible**: el diseño (título, fecha) está
  horneado dentro del video generado con Gemini. El HTML es sr-only.
  No "arregles" eso añadiendo texto visible encima: se duplicaría.
- **CSS por capas**: `@layer base, layout, components, sections, overrides`
  (declaradas en `src/styles/main.css`). Los overrides responsive y
  reduced-motion viven en `overrides.css` y SIEMPRE son la última capa.
  No añadir anchos con `section > *` (se eliminó a propósito: era frágil).
- **Todo self-hosted**: no introducir CDNs externos (fuentes, videos, nada).
  Se eliminó esa dependencia deliberadamente antes del día del evento.
- **Animaciones**: solo `transform`/`opacity`; siempre cubrir
  `prefers-reduced-motion` (bloque en `overrides.css`).
- La página es **privada** (`noindex`): no añadir analytics ni compartir URLs.

## Verificación

- `npm test` — 10 E2E de Playwright. En este sandbox:
  `CHROMIUM_PATH=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npx playwright test`
- `npm run lint` y `npm run typecheck` deben quedar en verde antes de push.
- El Chromium del sandbox no decodifica H.264: los videos fallan localmente
  con ERR_ABORTED — es limitación del entorno, no un bug (en Vercel funcionan).
- La URL de producción devuelve 403 a fetchers de este entorno (protección
  de Vercel); verificar con build local, no contra la URL en vivo.

## Estética (no romper)

Paleta noir + oro: fondo #0D0B09, oro #D4AF6E, champán #EBD9AC, rosa #C06A7A.
Serif Cormorant Garamond / sans Inter. Lenguaje visual: gemas de diamante,
destellos ✦, degradados dorados en texto, grano de película al 3%.
Cada fondo de sección tiene un concepto (el "&" gigante, constelación,
anillos de crecimiento, ondas de sonido) — no reemplazar por decoración genérica.

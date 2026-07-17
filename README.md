# Un Año Contigo 💛

Invitación digital de aniversario para Alejandra — 20 de julio de 2026.
Una sola página, estética *noir + oro* a luz de velas, con videos de fondo,
contador en vivo, galería, carta y confirmación por WhatsApp.

**Producción:** despliegue automático en Vercel con cada push a `main`.

## Stack

- **Vite** (vanilla JS, sin framework) + **vite-plugin-pwa** (offline)
- CSS puro con **Cascade Layers** (`@layer base, layout, components, sections, overrides`)
- Fuentes self-hosted (Cormorant Garamond + Inter, woff2)
- **Playwright** para tests E2E · ESLint + Stylelint · `tsc --checkJs`
- CI en GitHub Actions (lint + build + tests en cada push)

## Estructura

```
├── index.html              Estructura de la página (9 secciones en crescendo)
├── src/
│   ├── config.js           ⭐ ÚNICA FUENTE DE VERDAD: fechas, lugar, WhatsApp
│   ├── app.js              Orquestador (reveal, lazy videos, countdown, RSVP)
│   ├── sw.js               Service worker (Workbox, precache automático)
│   ├── modules/            audio · counter · event (ICS/mapa) · intro · lightbox
│   └── styles/
│       ├── main.css        Declara las capas e importa todo
│       ├── tokens.css      Paleta, tipografía, espaciado, --grain
│       ├── base|layout|components.css
│       ├── sections/       Un archivo por sección (intro, hero, …, footer)
│       └── overrides.css   Responsive + prefers-reduced-motion (capa final)
├── public/
│   ├── assets/             Videos, posters, fotos (webp+jpeg), iconos
│   └── audio/              La canción
├── tests/                  E2E: los momentos clave de la experiencia
└── vercel.json             Caché inmutable para assets; no-cache para HTML/SW
```

## Cómo editar

| Quiero cambiar… | Toco… |
|---|---|
| Fecha, hora, lugar, vestimenta, WhatsApp, mensaje de aceptación | `src/config.js` (y los textos visibles en `index.html`) |
| Textos (carta, razones, historia, captions) | `index.html` |
| Fotos | `public/assets/` + las rutas en `index.html` (webp + jpeg) |
| Videos de fondo | `public/assets/*-video*.mp4` — **usa un nombre nuevo** (la caché es inmutable) y actualiza `index.html` |
| Colores / tipografía | `src/styles/tokens.css` |
| Una sección concreta | `src/styles/sections/<sección>.css` |

## Comandos

```bash
npm run dev        # desarrollo con hot reload
npm run build      # build de producción (genera dist/ + sw.js)
npm run preview    # servir el build localmente
npm test           # E2E con Playwright (levanta el preview solo)
npm run lint       # ESLint + Stylelint
npm run typecheck  # tsc --checkJs (tipos vía JSDoc)
```

## Decisiones de arquitectura

- **Sin framework**: una página, contenido estático, módulos pequeños. Vanilla gana.
- **Crescendo narrativo**: hero → tiempo → historia → razones → recuerdos → **carta** → música → evento → **¿aceptas?**
- **El texto del hero vive dentro del video** (animado con Gemini); el HTML equivalente queda solo para lectores de pantalla/SEO.
- **Assets renombrados al cambiar** (`hero-video-3`, `message-video-2`…): `vercel.json` sirve `/assets` con caché inmutable de 1 año.
- **Todo self-hosted**: cero dependencias de CDNs externos el día de la cena.

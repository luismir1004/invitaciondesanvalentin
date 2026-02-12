/* ============================================================
   APP — Orquestador Principal (Floral Digital Experience v5.0)
   Fases: Unlock → Envelope → Big Bang Reveal → Bouquet → RSVP
   ============================================================ */

import gsap from 'gsap';
import confetti from 'canvas-confetti';
import Core from './modules/core.js';
import { playUnlockToEnvelope, playBigBangReveal, animateMemoryCards, addButtonHoverEffect } from './modules/animations.js';
import { initParticleField, fireHeartRain, initCursorTrail } from './modules/effects.js';
import { initUnlockCanvas } from './modules/unlock.js';
import { initAudioVisualizer } from './modules/visualizer.js';
import { initCounter } from './modules/counter.js';
import { playShimmerSound, playAmbientMelody } from './modules/audio.js';
import { growBouquet } from './modules/bouquet.js';
import { initParallax } from './modules/parallax.js';
import { initRoyalRSVP } from './modules/rsvp.js';

// ── Configuración ──────────────────────────────────────────
var RELATIONSHIP_START = new Date('2025-06-20T00:00:00');

// ── Inicialización ─────────────────────────────────────────
window.onload = function () {
    // 1. Fade out Preloader
    var preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(function () {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.setAttribute('aria-busy', 'false');
        }, 800); // Minimum luxury wait time
    }

    // 2. Initialize Core
    Core.init();
};

document.addEventListener('DOMContentLoaded', function () {

    // Iniciar efectos globales
    initCursorTrail();
    initParticleField();
    initParallax();

    // Ocultar audio toggle hasta la fase 3
    var audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) audioToggle.style.display = 'none';

    // FASE 1: Unlock — Dibujar inicial
    initUnlockCanvas(function onUnlocked() {
        // FASE 2: Transición a sobre
        playUnlockToEnvelope(function () {
            addButtonHoverEffect();

            // FASE 2B: Click para abrir (Sello o Sobre)
            var envelope = document.querySelector('.envelope');
            var seal = document.querySelector('.envelope-seal');

            function triggerOpen() {
                if (hasRevealed) return; // Prevent double trigger

                // 1. Animar apertura del sobre
                envelope.classList.add('is-open');

                // 2. Esperar animación (0.8s flap + slide)
                setTimeout(function () {
                    handleReveal();
                }, 800);
            }

            if (seal) seal.addEventListener('click', function (e) {
                e.stopPropagation(); // Prevent bubbling if needed
                triggerOpen();
            });

            if (envelope) envelope.addEventListener('click', triggerOpen);
        });
    });

    // Failsafe: Init Royal RSVP in case reveal logic is bypassed/delayed

});

// ── FASE 3: Big Bang Reveal + Floral Experience ─────────────
var hasRevealed = false;

function handleReveal() {
    if (hasRevealed) return;
    hasRevealed = true;

    playBigBangReveal(function onRevealComplete() {
        // Iniciar contador
        initCounter(RELATIONSHIP_START);

        // Iniciar visualizador de audio
        initAudioVisualizer();

        // Animar tarjetas de galería
        animateMemoryCards();

        // 🌸 Hacer brotar el ramo de flores
        setTimeout(function () {
            // Shimmer sound al brotar
            playShimmerSound();

            growBouquet(function onBouquetComplete() {
                // Melodía ambiental tras el ramo
                playAmbientMelody();

                // Mostrar botón de audio
                var audioToggle = document.getElementById('audio-toggle');
                if (audioToggle) {
                    audioToggle.style.display = '';
                    gsap.fromTo(audioToggle,
                        { scale: 0, opacity: 0 },
                        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
                    );
                }
            });
        }, 300);

        // 🎊 Lluvia de corazones
        setTimeout(function () {
            fireHeartRain();
        }, 500);

        // 💌 Inicializar RSVP (Royal Seal Version)
        setTimeout(function () {
            // Initialize the new Royal RSVP
            initRoyalRSVP();
        }, 1000);
    });
}

// Failsafe: Init Royal RSVP in case reveal logic is bypassed/delayed
setTimeout(function () {
    initRoyalRSVP();
}, 2000);

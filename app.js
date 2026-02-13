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
import { playShimmerSound, playAmbientMelody, updateButtonVisual } from './modules/audio.js';
import { growBouquet } from './modules/bouquet.js';
import { initParallax } from './modules/parallax.js';
import { initRoyalRSVP } from './modules/rsvp.js';

// ── Configuración ──────────────────────────────────────────
const CONFIG = {
    RELATIONSHIP_START: new Date('2025-06-20T00:00:00'),
    PRELOADER_MIN_TIME: 800,
    REVEAL_DELAY: 300,
    CONFETTI_DELAY: 500,
    RSVP_DELAY: 1000
};

// State
let hasRevealed = false;

// ── Inicialización ─────────────────────────────────────────

// Wait for DOM
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Global Setup
    setupGlobalEffects();
    setupAudioUI();

    // 1. Phase: Unlock
    await waitForUnlock();

    // 2. Phase: Transition to Envelope
    await transitionToEnvelope();

    // 3. Phase: Interactive Envelope (Wait for user action)
    setupEnvelopeInteraction();
});

// Window Load (Preloader)
window.onload = () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.visibility = 'hidden';
            document.body.setAttribute('aria-busy', 'false');
        }, CONFIG.PRELOADER_MIN_TIME);
    }

    // Initialize Core Systems
    Core.init ? Core.init() : null;
};

// ── Helper Functions ───────────────────────────────────────

function setupGlobalEffects() {
    initCursorTrail();
    initParticleField();
    initParallax();
}

async function setupAudioUI() {
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) audioToggle.style.display = 'none';

    // Ensure button state is correct if browser cached muted state
    updateButtonVisual();

    // Expose toggle globally for the HTML button
    window.toggleAudioMute = (await import('./modules/audio.js')).toggleAudioMute;
}

function waitForUnlock() {
    return new Promise((resolve) => {
        initUnlockCanvas(resolve);
    });
}

function transitionToEnvelope() {
    return new Promise((resolve) => {
        playUnlockToEnvelope(() => {
            addButtonHoverEffect();
            resolve();
        });
    });
}

function setupEnvelopeInteraction() {
    const envelope = document.querySelector('.envelope');
    const seal = document.querySelector('.envelope-seal');

    // Import unlocker dynamically to avoid top-level await issues if needed, 
    // or better, assume it's available via module scope if we change imports.
    // For now, let's just trigger the global audio unlock if exposed, or import it.

    const triggerOpen = async () => {
        if (hasRevealed) return;

        // 0. Unlock Audio Engine (Mobile Fix)
        // We must do this *immediately* on the user event (click)
        try {
            const { unlockAudio } = await import('./modules/audio.js');
            unlockAudio();
        } catch (e) {
            console.error("Audio unlock error:", e);
        }

        // 1. Hand over purely to GSAP for "Physical Extraction"
        // We skip adding 'is-open' class to prevent CSS conflicts
        handleBigBangReveal();
    };

    if (seal) seal.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerOpen();
    });

    if (envelope) envelope.addEventListener('click', triggerOpen);
}

// ── FASE 3: Big Bang Reveal ────────────────────────────────
async function handleBigBangReveal() {
    if (hasRevealed) return;
    hasRevealed = true;

    // Promise-based animation
    await new Promise(resolve => playBigBangReveal(resolve));

    // Post-Reveal Sequence
    initCounter(CONFIG.RELATIONSHIP_START);
    initAudioVisualizer();
    animateMemoryCards();

    // Floral Growth
    setTimeout(() => {
        playShimmerSound();

        growBouquet(() => {
            playAmbientMelody();
            showAudioControl();
        });
    }, CONFIG.REVEAL_DELAY);

    // Confetti Rain
    setTimeout(() => {
        fireHeartRain();
    }, CONFIG.CONFETTI_DELAY);

    // Initialize RSVP
    setTimeout(() => {
        initRoyalRSVP();
    }, CONFIG.RSVP_DELAY);
}

function showAudioControl() {
    const audioToggle = document.getElementById('audio-toggle');
    if (audioToggle) {
        audioToggle.style.display = '';
        gsap.fromTo(audioToggle,
            { scale: 0, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
    }
}

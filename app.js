/* ============================================================
   APP — Minimalista Moderno
   ============================================================ */

import { playAmbientMelody, toggleAudioMute, updateButtonVisual } from './modules/audio.js';
import { initCounter } from './modules/counter.js';

// ── Initialization ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialize counter
    const relationshipStart = new Date('2025-06-20T00:00:00');
    initCounter(relationshipStart);

    // Setup audio
    setupAudio();

    // Setup buttons
    setupButtons();
});

// ── Audio Setup ────────────────────────────────────────────
function setupAudio() {
    const audioButton = document.getElementById('audio-toggle');
    if (audioButton) {
        // Expose toggle globally for the button
        window.toggleAudioMute = toggleAudioMute;
        updateButtonVisual();
    }

    // Play ambient melody on user interaction
    const playOnInteraction = () => {
        playAmbientMelody();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    };

    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
}

// ── Button Setup ───────────────────────────────────────────
function setupButtons() {
    const rsvpButton = document.getElementById('rsvp-button');
    if (rsvpButton) {
        rsvpButton.addEventListener('click', () => {
            alert('¡Gracias por aceptar la invitación! 💕');
        });
    }

    // Audio button already has onclick in HTML
}

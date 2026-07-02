/* ============================================================
   APP — Minimalista Moderno
   ============================================================ */

import { playAmbientMelody, toggleAudioMute, updateButtonVisual } from './modules/audio.js';
import { initCounter } from './modules/counter.js';
import { initLightbox } from './modules/lightbox.js';

// ── Initialization ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Initialize counter
    const relationshipStart = new Date('2025-06-20T00:00:00');
    initCounter(relationshipStart);

    // Setup audio
    setupAudio();

    // Setup buttons
    setupButtons();

    // Setup photo lightbox
    initLightbox();

    // Setup scroll reveal
    initScrollReveal();
});

// ── Scroll Reveal ──────────────────────────────────────────
function initScrollReveal() {
    const elements = document.querySelectorAll('[data-reveal]');
    if (!elements.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    elements.forEach((el) => observer.observe(el));
}

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
const LUIS_WHATSAPP_NUMBER = '584121955216';

function setupButtons() {
    const rsvpButton = document.getElementById('rsvp-button');
    const confirmation = document.getElementById('rsvp-confirmation');

    if (rsvpButton) {
        rsvpButton.addEventListener('click', () => {
            const message = encodeURIComponent('¡Acepto la invitación! Un año contigo, Luis 💕');
            window.open(`https://wa.me/${LUIS_WHATSAPP_NUMBER}?text=${message}`, '_blank', 'noopener');

            if (confirmation) {
                confirmation.hidden = false;
            }
            rsvpButton.disabled = true;
        });
    }

    // Audio button already has onclick in HTML
}

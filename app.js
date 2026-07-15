/* ============================================================
   APP — Editorial Minimalista (Aniversario)
   ============================================================ */

import { playAmbientMelody, togglePlay, updateButtonVisual, initPlayerUI, initAudioToggle } from './modules/audio.js';
import { initCounter } from './modules/counter.js';
import { initLightbox } from './modules/lightbox.js';
import { initEvent } from './modules/event.js';
import { initIntro } from './modules/intro.js';

// ── Initialization ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    // Contador desde el inicio de la relación (editable en <html data-start-date>)
    const startDateStr = document.documentElement.dataset.startDate || '2025-07-20T00:00:00';
    initCounter(new Date(startDateStr));

    initIntro();
    setupAudio();
    setupButtons();
    initLightbox();
    initEvent();
    initScrollReveal();
    initScrollFade();
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
    initPlayerUI();
    initAudioToggle();
    updateButtonVisual();

    // Play on first user interaction (mobile autoplay unlock)
    const playOnInteraction = () => {
        playAmbientMelody();
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
    };
    document.addEventListener('click', playOnInteraction);
    document.addEventListener('touchstart', playOnInteraction);
}

// ── Scroll Fade (hero scroll indicator) ───────────────────
function initScrollFade() {
    const scrollHint = document.querySelector('.hero-scroll');
    if (!scrollHint) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    window.addEventListener('scroll', () => {
        const opacity = Math.max(0, 1 - window.scrollY / 200);
        scrollHint.style.opacity = opacity;
        scrollHint.style.pointerEvents = opacity === 0 ? 'none' : '';
    }, { passive: true });
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
                confirmation.removeAttribute('hidden');
                requestAnimationFrame(() => confirmation.classList.add('is-visible'));
            }
            rsvpButton.disabled = true;
        });
    }
}

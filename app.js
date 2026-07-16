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
    initLazyVideos();
});

// ── Scroll Reveal ──────────────────────────────────────────
function initScrollReveal() {
    const elements = Array.from(document.querySelectorAll('[data-reveal]'));
    if (!elements.length) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion || !('IntersectionObserver' in window)) {
        elements.forEach((el) => el.classList.add('is-visible'));
        return;
    }

    // El hero espera a que se abra el telón: así Ale sí ve la
    // animación de entrada (si no, ocurre oculta detrás del intro).
    const intro = document.getElementById('intro');
    const heroElements = elements.filter((el) => el.closest('.hero'));
    const scrollElements = elements.filter((el) => !el.closest('.hero'));

    if (intro && !intro.hidden && heroElements.length) {
        document.addEventListener('intro:open', () => {
            heroElements.forEach((el) => el.classList.add('is-visible'));
        }, { once: true });
    } else {
        heroElements.forEach((el) => el.classList.add('is-visible'));
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0, rootMargin: '0px 0px -10% 0px' });

    scrollElements.forEach((el) => observer.observe(el));
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

// ── Lazy Video Loading ────────────────────────────────────
function initLazyVideos() {
    const videos = document.querySelectorAll('video[data-lazy-src]');
    if (!videos.length) return;

    if (!('IntersectionObserver' in window)) {
        videos.forEach((v) => { v.src = v.dataset.lazySrc; v.play().catch(() => {}); });
        return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const video = entry.target;
                video.src = video.dataset.lazySrc;
                video.play().catch(() => {});
                obs.unobserve(video);
            }
        });
    }, { rootMargin: '200px 0px' });

    videos.forEach((v) => observer.observe(v));
}

// ── Button Setup ───────────────────────────────────────────
const LUIS_WHATSAPP_NUMBER = '584121955216';

function setupButtons() {
    const rsvpButton = document.getElementById('rsvp-button');
    const confirmation = document.getElementById('rsvp-confirmation');

    if (rsvpButton) {
        rsvpButton.addEventListener('click', () => {
            const message = encodeURIComponent(
                '💛 *¡Sí, acepto!* 💛\n\n' +
                'Mi amor, acepto tu invitación para celebrar nuestro primer año juntos. 🥂\n\n' +
                'Nos vemos el *20 de julio* en Bonsai Sushi. ✨\n\n' +
                'Te amo, Luis. Un año contigo y apenas comienza. 💕'
            );
            const url = `https://wa.me/${LUIS_WHATSAPP_NUMBER}?text=${message}`;
            const win = window.open(url, '_blank', 'noopener');
            if (!win) {
                // Popup bloqueado: navegar directo para no perder el mensaje
                window.location.href = url;
                return;
            }

            if (confirmation) {
                confirmation.removeAttribute('hidden');
                requestAnimationFrame(() => confirmation.classList.add('is-visible'));
            }
            rsvpButton.disabled = true;
        });
    }
}

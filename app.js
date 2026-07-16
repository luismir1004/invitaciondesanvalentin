/* ============================================================
   APP — Editorial Minimalista (Aniversario)
   ============================================================ */

import { playAmbientMelody, togglePlay, updateButtonVisual, initPlayerUI, initAudioToggle } from './modules/audio.js';
import { initCounter } from './modules/counter.js';
import { initLightbox } from './modules/lightbox.js';
import { initEvent, EVENT } from './modules/event.js';
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
    initEventCountdown();
});

// ── Cuenta regresiva a la celebración ─────────────────────
function initEventCountdown() {
    const el = document.getElementById('event-countdown');
    if (!el) return;

    const s = EVENT.start;

    function update() {
        const now = new Date();
        // Días de calendario hasta la cena (a medianoche del día del evento)
        const startOfEventDay = new Date(s.year, s.month - 1, s.day);
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const days = Math.round((startOfEventDay - startOfToday) / 86400000);

        if (days > 1) {
            el.textContent = `Faltan ${days} días para nuestra celebración ✨`;
        } else if (days === 1) {
            el.textContent = '¡Mañana es nuestra celebración! ✨';
        } else if (days === 0) {
            el.textContent = '¡Hoy es el día! Nos vemos a las 7:00 PM 🥂';
        } else {
            el.textContent = 'Ya celebramos nuestro primer año… y vamos por muchos más 💛';
        }
        el.hidden = false;
    }

    update();
    // Refresca al cruzar medianoche si deja la página abierta
    setInterval(update, 60000);
}

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

// ── Celebración (lluvia de corazones al aceptar) ──────────
function celebrate(origin) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const symbols = ['❤', '💛', '✨', '❤', '✨'];
    const rect = origin.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 26; i++) {
        const heart = document.createElement('span');
        heart.className = 'celebrate-heart';
        heart.textContent = symbols[i % symbols.length];
        heart.setAttribute('aria-hidden', 'true');

        const spreadX = (Math.random() - 0.5) * 320;     // dispersión horizontal
        const rise = 260 + Math.random() * 320;          // altura del vuelo
        const size = 0.8 + Math.random() * 1.3;
        const duration = 1.6 + Math.random() * 1.6;
        const delay = Math.random() * 0.55;

        heart.style.left = `${originX}px`;
        heart.style.top = `${originY}px`;
        heart.style.fontSize = `${size}rem`;
        heart.style.setProperty('--spread-x', `${spreadX}px`);
        heart.style.setProperty('--rise', `${-rise}px`);
        heart.style.animationDuration = `${duration}s`;
        heart.style.animationDelay = `${delay}s`;

        document.body.appendChild(heart);
        heart.addEventListener('animationend', () => heart.remove());
    }
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
            rsvpButton.classList.add('is-accepted');
            rsvpButton.textContent = '✓ Aceptada 💛';
            celebrate(rsvpButton);
        });
    }
}

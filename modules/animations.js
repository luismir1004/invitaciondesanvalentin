/* ============================================================
   ANIMATIONS MODULE — Cinematic "Big Bang" Reveal
   GSAP Timeline: 3D rotation, stagger, mesh explosion.
   ============================================================ */

import gsap from 'gsap';

/**
 * Transition from unlock screen to envelope.
 * @param {Function} onComplete
 */
export function playUnlockToEnvelope(onComplete) {
    var unlockSection = document.getElementById('unlock-section');
    var envelopeSection = document.getElementById('envelope-section');
    if (!unlockSection || !envelopeSection) return;

    var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
            if (typeof onComplete === 'function') onComplete();
        }
    });

    // Unlock fades out & scales down
    tl.to(unlockSection, {
        opacity: 0,
        scale: 0.9,
        duration: 0.6,
        ease: 'power2.in',
        onComplete: function () {
            unlockSection.style.display = 'none';
            unlockSection.style.pointerEvents = 'none'; // Safety
            unlockSection.setAttribute('aria-hidden', 'true');
        }
    });

    // Show envelope
    tl.call(function () {
        envelopeSection.hidden = false;
        envelopeSection.style.display = '';
        envelopeSection.style.pointerEvents = 'auto'; // Re-enable interaction
    });

    // Envelope enters
    tl.fromTo(envelopeSection,
        { y: 50, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8 }
    );

    return tl;
}

/**
 * The Big Bang Reveal — Executive "Dissolve & Ascend"
 * Replaces explosive effects with a premium, smooth transition.
 * @param {Function} onComplete
 */
export function playBigBangReveal(onComplete) {
    var envelopeSection = document.getElementById('envelope-section');
    var cardSection = document.getElementById('card-section');
    var cardInner = cardSection ? cardSection.querySelector('.card-inner') : null;
    var envelopeFlap = document.querySelector('.envelope-flap');
    var envelope = document.querySelector('.envelope');
    var meshBg = document.getElementById('mesh-bg');

    if (!envelopeSection || !cardSection || !cardInner) return;

    var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
            if (typeof onComplete === 'function') onComplete();
        }
    });

    // 1. Flap opens gracefully
    tl.to(envelopeFlap, {
        rotateX: -180,
        duration: 0.8,
        ease: 'power2.inOut'
    });

    // 2. Envelope "Evaporates" (Executive Dissolve)
    // Instead of shrinking/flying, it gently expands and fades.
    tl.to(envelope, {
        scale: 1.05,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: function () {
            envelopeSection.style.display = 'none';
            envelopeSection.style.pointerEvents = 'none'; // Critical Safety
            envelopeSection.setAttribute('aria-hidden', 'true');
        }
    }, '-=0.4');

    // 3. Ambient Light Shift (Subtle)
    tl.call(function () {
        if (meshBg) meshBg.classList.add('mesh-exploded'); // Keeps the color shift, but softer transition
    }, null, '-=0.6');

    // 4. Reveal Card Section Container
    tl.call(function () {
        cardSection.hidden = false;
        cardSection.style.display = '';
    }, null, '-=0.2');

    // 5. Card Entry — "The Executive Rise"
    // No rotation. Just a clean, vertical ascent with opacity.
    tl.fromTo(cardInner,
        {
            y: 40,
            opacity: 0,
            scale: 0.98,
            transformPerspective: 1200,
            rotateX: 2 // Tiny tilt for depth, effectively flat
        },
        {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1.4,
            ease: 'expo.out' // Ultra-smooth landing
        },
        '-=0.4'
    );

    // 6. Content Waterfall — Elegant Stagger
    var staggerElements = cardInner.querySelectorAll(
        '.card-header, .divider, .message-line, .music-player, .memories-section, .counter-section, .card-footer'
    );

    tl.fromTo(staggerElements,
        { y: 20, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.12, // Slower stagger for readability
            ease: 'power2.out'
        },
        '-=1.0'
    );

    return tl;
}

/**
 * Animate memory cards with Scroll Reveal + Floating.
 * Cards fade in as they enter viewport, then float gently.
 */
export function animateMemoryCards() {
    var cards = document.querySelectorAll('.memory-card');
    if (!cards.length) return;

    // 1. Initial State for Scroll Reveal
    gsap.set(cards, {
        opacity: 0,
        y: 50,
        filter: 'blur(10px)'
    });

    // 2. Observer for Reveal
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var card = entry.target;
                observer.unobserve(card); // Only animate once

                // Reveal Animation
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1.2,
                    ease: 'power3.out',
                    onComplete: function () {
                        // 3. Start Floating after reveal
                        startFloating(card);
                    }
                });
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom
    });

    cards.forEach(function (card) {
        observer.observe(card);
    });

    function startFloating(card) {
        var duration = 4 + Math.random() * 2;
        var rotateAmount = 0.8 + Math.random() * 1.2;
        var yAmount = 3 + Math.random() * 4;

        gsap.to(card, {
            y: yAmount,
            rotation: rotateAmount,
            duration: duration,
            ease: 'sine.inOut',
            yoyo: true,
            repeat: -1
        });
    }
}

/**
 * Efecto hover GSAP para el botón.
 */
export function addButtonHoverEffect() {
    var btn = document.getElementById('open-btn');
    if (!btn) return;

    btn.addEventListener('mouseenter', function () {
        gsap.to(btn, { scale: 1.04, duration: 0.3, ease: 'power2.out' });
    });
    btn.addEventListener('mouseleave', function () {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
    });
}

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
/**
 * The "Realistic Extraction" Open
 * Simulates pulling the card out of the envelope and bringing it into focus.
 * @param {Function} onComplete
 */
export function playBigBangReveal(onComplete) {
    var envelopeSection = document.getElementById('envelope-section');
    var cardSection = document.getElementById('card-section');
    var cardInner = cardSection ? cardSection.querySelector('.card-inner') : null;
    var envelopeFlap = document.querySelector('.envelope-flap');
    var envelope = document.querySelector('.envelope');
    var envelopeSeal = document.querySelector('.envelope-seal');
    var cardPreview = document.querySelector('.envelope-card-preview');
    var meshBg = document.getElementById('mesh-bg');

    if (!envelopeSection || !cardSection || !cardInner) return;

    var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
            if (typeof onComplete === 'function') onComplete();
        }
    });

    // 0. Seal Dissolves (Subtle)
    tl.to(envelopeSeal, {
        opacity: 0,
        scale: 0.8,
        duration: 0.4,
        ease: 'power2.in'
    });

    // 1. Flap Opens (Natural Physics)
    // back.out gives it a little "hinge bounce" at the end
    tl.to(envelopeFlap, {
        rotateX: -180,
        duration: 0.8,
        ease: 'back.out(1.2)'
    }, '-=0.2');

    // 2. The Extraction (Cinematic Pull)
    // Card goes UP, Envelope goes DOWN (Parallax separation)
    tl.to(cardPreview, {
        y: -180,
        zIndex: 5,
        duration: 1.0,
        ease: 'power2.inOut'
    }, '-=0.4');

    tl.to(envelope, {
        y: 100,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.in'
    }, '<'); // Starts same time as card move

    // 3. Reveal Actual Card (Zoom In Transition)
    tl.call(function () {
        envelopeSection.style.display = 'none'; // Clear envelope
        cardSection.hidden = false;
        cardSection.style.display = '';
        if (meshBg) meshBg.classList.add('mesh-exploded');
    });

    // Card lands as if camera zoomed into the preview
    tl.fromTo(cardInner,
        {
            opacity: 0,
            scale: 0.8, // Started small (like the preview)
            y: 20
        },
        {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: 'expo.out' // Soft landing
        }
    );

    // 4. Content Flows In (Elegant Stagger)
    var staggerElements = cardInner.querySelectorAll(
        '.card-header, .divider, .message-line, .music-player, .memories-section, .counter-section, .card-footer'
    );

    tl.fromTo(staggerElements,
        { y: 30, opacity: 0 },
        {
            y: 0,
            opacity: 1,
            duration: 1.0,
            stagger: 0.15,
            ease: 'power2.out'
        },
        '-=0.8'
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

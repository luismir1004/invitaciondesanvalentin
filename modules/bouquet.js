/* ============================================================
   BOUQUET — Photorealistic Floral Presentation
   Premium image reveal + GSAP animations + sparkle particles
   ============================================================ */

import gsap from 'gsap';
import Core from './core.js';

var container, image, pollenCanvas, pollenCtx, glowEl;
var particles = [];
var animFrame = null;
var isReady = false;

/* ── Sparkle Particle Class ───────────────────────────────── */
function Particle(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = -Math.random() * 2.5 - 0.5;
    this.life = 1;
    this.decay = 0.015 + Math.random() * 0.02;
    this.size = 1.5 + Math.random() * 2.5;
    this.hue = Math.random() > 0.5 ? 40 : 340; // Gold or Rose
    this.saturation = 60 + Math.random() * 30;
}

Particle.prototype.update = function () {
    this.x += this.vx;
    this.vy += 0.02; // gentle gravity
    this.y += this.vy;
    this.life -= this.decay;
    this.size *= 0.99;
};

Particle.prototype.draw = function (ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life * 0.8;
    ctx.fillStyle = 'hsla(' + this.hue + ',' + this.saturation + '%,75%,1)';
    ctx.shadowColor = 'hsla(' + this.hue + ',' + this.saturation + '%,80%,0.6)';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};

/* ── Pollen / Sparkle Canvas Animation ────────────────────── */
function initPollenCanvas() {
    pollenCanvas = document.getElementById('pollen-canvas');
    if (!pollenCanvas) return;

    pollenCtx = pollenCanvas.getContext('2d');
    resizePollenCanvas();

    function animate() {
        animFrame = requestAnimationFrame(animate);
        pollenCtx.clearRect(0, 0, pollenCanvas.width, pollenCanvas.height);

        // Ambient floating particles
        if (Math.random() < 0.15 && isReady) {
            var px = Math.random() * pollenCanvas.width;
            var py = pollenCanvas.height * 0.2 + Math.random() * pollenCanvas.height * 0.6;
            var p = new Particle(px, py);
            p.vy = -Math.random() * 0.8 - 0.2;
            p.vx = (Math.random() - 0.5) * 0.5;
            p.decay = 0.005 + Math.random() * 0.008;
            p.size = 1 + Math.random() * 1.5;
            particles.push(p);
        }

        for (var i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw(pollenCtx);
            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
    }
    animate();
}

function resizePollenCanvas() {
    if (!pollenCanvas || !container) return;
    var rect = container.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    pollenCanvas.width = rect.width * dpr;
    pollenCanvas.height = rect.height * dpr;
    pollenCanvas.style.width = rect.width + 'px';
    pollenCanvas.style.height = rect.height + 'px';
    if (pollenCtx) pollenCtx.scale(dpr, dpr);
}

/* ── Interactive sparkle burst on touch/hover ─────────────── */
function spawnBurst(x, y, count) {
    for (var i = 0; i < count; i++) {
        var p = new Particle(x, y);
        p.vx = (Math.random() - 0.5) * 4;
        p.vy = (Math.random() - 0.5) * 4;
        particles.push(p);
    }
}

/* ── growBouquet — Main entry point ────────────────────────── */
export function growBouquet(onComplete) {
    container = document.getElementById('bouquet-container');
    image = document.getElementById('bouquet-image');
    glowEl = container ? container.querySelector('.bouquet-glow') : null;

    if (!container || !image) {
        if (typeof onComplete === 'function') onComplete();
        return;
    }

    // Initialize pollen canvas
    initPollenCanvas();

    // ── Set initial state (hidden) ───────────────────────────
    gsap.set(image, {
        opacity: 0,
        scale: 0.6,
        y: 40,
        filter: 'blur(12px) saturate(0.3)'
    });

    if (glowEl) {
        gsap.set(glowEl, { opacity: 0, scale: 0.5 });
    }

    // ── Growth timeline ──────────────────────────────────────
    var tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: function () {
            isReady = true;
            startIdleAnimation();
            if (typeof onComplete === 'function') onComplete();
        }
    });

    // Phase 1: Glow appears first
    if (glowEl) {
        tl.to(glowEl, {
            opacity: 0.6,
            scale: 1,
            duration: 0.8,
            ease: 'power2.out'
        }, 0);
    }

    // Phase 2: Image blooms in
    tl.to(image, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px) saturate(1.1)',
        duration: 1.8,
        ease: 'power2.out'
    }, 0.2);

    // Phase 3: Subtle shine sweep
    tl.to(image, {
        filter: 'blur(0px) saturate(1.2) brightness(1.08)',
        duration: 0.6,
        yoyo: true,
        repeat: 1,
        ease: 'sine.inOut'
    }, 1.6);

    // ── Touch/hover interaction ──────────────────────────────
    container.addEventListener('pointermove', function (e) {
        if (!isReady) return;
        var rect = container.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        // Subtle parallax on image
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;
        var moveX = (x - centerX) / centerX * 4;
        var moveY = (y - centerY) / centerY * 3;

        gsap.to(image, {
            x: moveX,
            y: moveY,
            rotateY: moveX * 0.5,
            rotateX: -moveY * 0.5,
            duration: 0.8,
            ease: 'power2.out',
            overwrite: 'auto'
        });

        // Sparkle trail
        if (Math.random() < 0.3) {
            spawnBurst(x, y, 1);
        }
    });

    container.addEventListener('pointerleave', function () {
        gsap.to(image, {
            x: 0, y: 0, rotateY: 0, rotateX: 0,
            duration: 1.2,
            ease: 'elastic.out(1, 0.4)',
            overwrite: 'auto'
        });
    });

    container.addEventListener('pointerdown', function (e) {
        if (!isReady) return;
        var rect = container.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        spawnBurst(x, y, 15);

        // Pulse effect
        gsap.to(image, {
            scale: 1.04,
            filter: 'blur(0px) saturate(1.4) brightness(1.12)',
            duration: 0.2,
            ease: 'power2.out',
            onComplete: function () {
                gsap.to(image, {
                    scale: 1,
                    filter: 'blur(0px) saturate(1.1) brightness(1)',
                    duration: 0.8,
                    ease: 'elastic.out(1, 0.3)'
                });
            }
        });
    });

    // Resize
    if (Core && Core.events) {
        Core.events.addEventListener('app:resize', resizePollenCanvas);
    } else {
        window.addEventListener('resize', resizePollenCanvas);
    }
}

/* ── Idle "breathing" animation ───────────────────────────── */
function startIdleAnimation() {
    if (!image) return;

    // Subtle continuous breathing
    gsap.to(image, {
        scale: 1.015,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
    });
}

/* ── bouquetGlow — Called from RSVP ────────────────────────── */
export function bouquetGlow() {
    if (!image || !glowEl) return;

    gsap.to(glowEl, {
        opacity: 1,
        scale: 1.3,
        duration: 0.6,
        ease: 'power2.out',
        onComplete: function () {
            gsap.to(glowEl, {
                opacity: 0.4,
                scale: 1,
                duration: 1.2,
                ease: 'power2.inOut'
            });
        }
    });

    gsap.to(image, {
        filter: 'blur(0px) saturate(1.5) brightness(1.2)',
        duration: 0.5,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
    });

    // Big sparkle burst
    if (pollenCanvas) {
        var cx = pollenCanvas.width / ((window.devicePixelRatio || 1) * 2);
        var cy = pollenCanvas.height / ((window.devicePixelRatio || 1) * 2);
        spawnBurst(cx, cy, 30);
    }
}

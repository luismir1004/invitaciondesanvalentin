/* ============================================================
   EFFECTS MODULE
   Magnetic Particle Field + Cursor Trail + Heart Rain
   ============================================================ */

import Core from './core.js';
import confetti from 'canvas-confetti';

/* ── Magnetic Particle Field ──────────────────────────────── */

/**
 * Creates a magnetic attraction particle field behind the envelope.
 * Particles follow cursor/touch with simulated force field.
 */
export function initParticleField() {
    var canvas = document.getElementById('particle-field');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];
    var mouseX = window.innerWidth / 2;
    var mouseY = window.innerHeight / 2;
    var particleCount = Math.min(80, Math.floor(window.innerWidth * window.innerHeight / 12000));

    // Use Shared Core Resize
    function resize() {
        if (!Core) return;
        canvas.width = Core.viewport.width;
        canvas.height = Core.viewport.height;
    }
    resize();

    if (Core && Core.events) {
        Core.events.addEventListener('app:resize', resize);
    } else {
        window.addEventListener('resize', resize);
    }

    // Pointer tracking handled by Core
    function getPointer() {
        return Core ? Core.input : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var input = getPointer();
        var targetX = input.x;
        var targetY = input.y;

        for (var i = 0; i < particles.length; i++) {
            var p = particles[i];

            // Distance to mouse
            var dx = targetX - p.x;
            var dy = targetY - p.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            var maxDist = 200;

            // Magnetic attraction force
            if (dist < maxDist) {
                var force = (1 - dist / maxDist) * 0.08;
                p.vx += dx * force * 0.01;
                p.vy += dy * force * 0.01;
            }

            // Spring back to base position
            var homeX = p.baseX - p.x;
            var homeY = p.baseY - p.y;
            p.vx += homeX * 0.005;
            p.vy += homeY * 0.005;

            // Friction
            p.vx *= 0.92;
            p.vy *= 0.92;

            p.x += p.vx;
            p.y += p.vy;

            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = 'hsla(' + p.hue + ', 70%, 70%, ' + p.alpha + ')';
            ctx.fill();

            // Draw connections between close particles
            for (var j = i + 1; j < particles.length; j++) {
                var p2 = particles[j];
                var cdx = p.x - p2.x;
                var cdy = p.y - p2.y;
                var cdist = Math.sqrt(cdx * cdx + cdy * cdy);

                if (cdist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.strokeStyle = 'hsla(340, 60%, 65%, ' + (0.1 * (1 - cdist / 100)) + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();

    return {
        destroy: function () {
            // No need to remove global listeners as they are now managed by Core
        }
    };
}

/* ── Heart Confetti Rain ──────────────────────────────────── */

export function fireHeartRain() {
    // Check if confetti works, otherwise fallback or return
    if (!confetti) return;

    var heartShape = confetti.shapeFromPath({
        path: 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'
    });

    var duration = 5000;
    var end = Date.now() + duration;

    function frame() {
        confetti({
            particleCount: 3,
            angle: 90,
            spread: 140,
            startVelocity: 25,
            decay: 0.93,
            gravity: 0.5,
            ticks: 250,
            origin: { x: Math.random(), y: -0.1 },
            shapes: [heartShape],
            colors: ['#e8638b', '#b8245e', '#d4a574', '#9b7ec8', '#fde8d8', '#f5a0c0'],
            scalar: 1.3
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }

    frame();
}

/* ── Cursor Trail (Shimmer particles) ─────────────────────── */

/* ── Cursor Trail (Golden Dust) ───────────────────────────── */

export function initCursorTrail() {
    if (!window.matchMedia('(pointer: fine)').matches) return;

    var canvas = document.getElementById('cursor-trail');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var particles = [];

    // Resize via Core
    function resize() {
        if (!Core) return;
        canvas.width = Core.viewport.width;
        canvas.height = Core.viewport.height;
    }
    resize();

    if (Core && Core.events) {
        Core.events.addEventListener('app:resize', resize);
    } else {
        window.addEventListener('resize', resize);
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        var input = Core ? Core.input : { x: -100, y: -100 };
        var mouseX = input.x;
        var mouseY = input.y;

        var isActive = (mouseX > 0 && mouseY > 0);

        if (isActive) {
            // Spawn Golden Dust
            // Higher density, smaller size
            for (var i = 0; i < 4; i++) {
                particles.push({
                    x: mouseX + (Math.random() - 0.5) * 8, // Tighter spread
                    y: mouseY + (Math.random() - 0.5) * 8,
                    vx: (Math.random() - 0.5) * 0.8,
                    vy: (Math.random() - 0.5) * 0.8 - 0.2, // Slight upward drift
                    life: 1,
                    decay: 0.02 + Math.random() * 0.03, // Faster decay
                    size: 0.5 + Math.random() * 1.5, // Tiny dust
                    hue: 35 + Math.random() * 15 // Pure Gold range (35-50)
                });
            }

            // Main "Wand" tip glow
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.8)'; // Gold
            ctx.fill();

            // Broad soft glow
            var glow = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 20);
            glow.addColorStop(0, 'rgba(255, 215, 0, 0.2)');
            glow.addColorStop(1, 'rgba(255, 215, 0, 0)');
            ctx.fillStyle = glow;
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 20, 0, Math.PI * 2);
            ctx.fill();
        }

        for (var i = particles.length - 1; i >= 0; i--) {
            var p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            // Sparkle effect: white center, gold edge
            ctx.fillStyle = 'hsla(' + p.hue + ', 80%, ' + (50 + p.life * 40) + '%, ' + p.life + ')';
            ctx.fill();
        }

        if (particles.length > 250) {
            particles.splice(0, particles.length - 250);
        }
    }

    animate();
}

/* ── Premium Confetti (Rose Petals & Gold) ────────────────── */
export function firePremiumConfetti() {
    if (!confetti) return;

    // Rose Petal Shape (safe check)
    var petalLeft = 'circle'; // Default fallback
    try {
        if (confetti && confetti.shapeFromPath) {
            petalLeft = confetti.shapeFromPath({ path: 'M10 10 C 20 0 30 0 40 10 C 50 20 50 30 40 40 C 30 50 20 50 10 40 C 0 30 0 20 10 10' });
        }
    } catch (e) {
        console.warn('Shape from path not supported, defaulting to circle');
    }

    // Gold Burst
    confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#FFD700', '#F0E68C', '#B8860B'], // Gold shades
        startVelocity: 40,
        gravity: 0.8,
        scalar: 0.8,
        drift: 0,
        ticks: 200
    });

    // Falling Petals (Slower, drifting)
    var end = Date.now() + 2000;
    var colors = ['#C4727F', '#D4919B', '#9D4E5B']; // Rose shades

    (function frame() {
        confetti({
            particleCount: 3,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors,
            shapes: [petalLeft],
            scalar: 1.5,
            drift: 1,
            gravity: 0.4, // floaty
            ticks: 300
        });
        confetti({
            particleCount: 3,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors,
            shapes: [petalLeft],
            scalar: 1.5,
            drift: -1,
            gravity: 0.4,
            ticks: 300
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
};

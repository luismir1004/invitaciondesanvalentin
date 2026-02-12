/* ============================================================
   UNLOCK MODULE — Romantic Cipher
   Draw an initial on Canvas to unlock the envelope.
   Uses unified Pointer Events API (mouse + touch + pen).
   ============================================================ */

import gsap from 'gsap';

/**
 * Initializes the drawing canvas for the unlock step.
 * Detects when user has drawn enough and triggers unlock.
 * @param {Function} onUnlock — Called when unlock is triggered
 */
export function initUnlockCanvas(onUnlock) {
    var canvas = document.getElementById('draw-canvas');
    var clearBtn = document.getElementById('clear-draw-btn');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var isDrawing = false;
    var strokeCount = 0;
    var totalPixels = 0;
    var unlockTriggered = false;

    // ── Canvas sizing (DPR-aware for sharp rendering) ────────────
    var SIZE = 200;
    var dpr = window.devicePixelRatio || 1;
    canvas.style.width = SIZE + 'px';
    canvas.style.height = SIZE + 'px';
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    ctx.scale(dpr, dpr);

    // ── Ensure interactivity ─────────────────────────────────────
    canvas.style.cursor = 'crosshair';
    canvas.style.touchAction = 'none';
    canvas.style.position = 'relative';
    canvas.style.zIndex = '2';

    // ── Drawing style ("Liquid Gold") ───────────
    var lastX = 0;
    var lastY = 0;
    var lastTime = 0;

    // Config
    var MIN_WIDTH = 1.5;
    var MAX_WIDTH = 5.5;

    function setupStyle() {
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.shadowColor = '#FFD700'; // Pure Gold
        ctx.shadowBlur = 15; // Luxurious glow
    }
    setupStyle();

    // ── Helpers ───────────────────────────────────────────────────
    function getPos(e) {
        // Use native offsetX/Y if available for performance (avoids getBoundingClientRect reflow)
        if (e.offsetX !== undefined) {
            return { x: e.offsetX, y: e.offsetY };
        }
        // Fallback
        var r = canvas.getBoundingClientRect();
        return {
            x: (e.clientX || 0) - r.left,
            y: (e.clientY || 0) - r.top
        };
    }

    // Advanced Particle System with Gravity & Drift
    function spawnSparkle(x, y, speed) {
        var count = Math.ceil(speed * 0.5); // More sparkles on fast strokes
        if (count > 3) count = 3;

        // Cache parent offset (usually 0 if parent is relative and canvas is top-left)
        // We assume 0 for performance during drag to avoid reading layout properties
        var offsetX = 0;
        var offsetY = 0;

        for (var i = 0; i < count; i++) {
            var s = document.createElement('div');
            s.className = 'gold-sparkle';

            // Random Premium Gold variations (H: 45-50, S: 100%, L: 60-80%)
            var hue = 45 + Math.random() * 5;
            var light = 60 + Math.random() * 20;

            s.style.position = 'absolute';
            // Use local coordinates directly
            s.style.left = (x + offsetX) + 'px';
            s.style.top = (y + offsetY) + 'px';
            s.style.width = (1 + Math.random() * 3) + 'px'; // Slightly varying sizes
            s.style.height = s.style.width;
            s.style.background = 'hsl(' + hue + ', 100%, ' + light + '%)';
            s.style.borderRadius = '50%';
            s.style.pointerEvents = 'none';
            s.style.boxShadow = '0 0 ' + (4 + Math.random() * 4) + 'px ' + 'hsl(' + hue + ', 100%, 50%)';
            s.style.opacity = '1';
            s.style.zIndex = '3';

            // Physics
            var angle = Math.random() * Math.PI * 2;
            var vel = 10 + Math.random() * 30;
            var vx = Math.cos(angle) * vel;
            var vy = Math.sin(angle) * vel;

            canvas.parentNode.appendChild(s);

            // Animate using Web Animations API (cleaner than rAF loop for simple DOM)
            s.animate([
                { transform: 'translate(-50%, -50%)', opacity: 1 },
                { transform: 'translate(calc(-50% + ' + vx + 'px), calc(-50% + ' + (vy + 30) + 'px))', opacity: 0 } // +30y for Gravity
            ], {
                duration: 500 + Math.random() * 500,
                easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
                fill: 'forwards'
            }).onfinish = function () { s.remove(); };
        }
    }

    function startDraw(e) {
        if (unlockTriggered) return;
        e.preventDefault();
        isDrawing = true;
        canvas.setPointerCapture(e.pointerId);
        var pos = getPos(e);
        lastX = pos.x;
        lastY = pos.y;
        lastTime = Date.now();

        ctx.beginPath();
        // Dot at start
        ctx.fillStyle = '#e6c89c';
        ctx.arc(pos.x, pos.y, MAX_WIDTH / 2, 0, Math.PI * 2);
        ctx.fill();

        spawnSparkle(pos.x, pos.y, 2);
    }

    function draw(e) {
        if (!isDrawing || unlockTriggered) return;
        e.preventDefault();
        var pos = getPos(e);
        var time = Date.now();

        // Calculate speed
        var dist = Math.sqrt(Math.pow(pos.x - lastX, 2) + Math.pow(pos.y - lastY, 2));
        var dt = time - lastTime;
        var speed = dist / (dt || 1); // pixels per ms

        // Dynamic line width (Slow = Thick, Fast = Thin)
        var targetWidth = MAX_WIDTH - Math.min(speed * 2, MAX_WIDTH - MIN_WIDTH);

        // Smooth transition
        ctx.lineWidth = targetWidth; // Simple assumption for now, or use complex localized width
        ctx.strokeStyle = '#e6c89c';

        // To do perfect variable width strokes requires drawing segments as filled paths
        // For performance/aesthetic balance, we'll just stroke lineTo but update lineWidth
        // Note: rapid changes might look segmented in standard canvas 2d without extra logic
        // Let's use a simpler approach: multiple strokes or quadratic curve if possible.
        // For this effect, simple lineTo with updated lineWidth is usually "okay" but can be jagged.
        // Better: Quadratic curve to midpoint.

        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();

        totalPixels += Math.ceil(dist / 2);

        if (dist > 3) {
            spawnSparkle(pos.x, pos.y, speed);
        }

        lastX = pos.x;
        lastY = pos.y;
        lastTime = time;
    }

    function endDraw(e) {
        if (!isDrawing) return;
        isDrawing = false;
        strokeCount++;
        ctx.closePath();

        // Smart Threshold: Require somewhat complex input (mimicking a letter)
        // Tune: Lowered to 80 for better responsiveness on mobile/quick strokes
        console.log('Total pixels drawn:', totalPixels);

        if (!unlockTriggered && totalPixels > 80) {
            // Debounce check to let them finish the letter
            clearTimeout(window.unlockTimer);
            window.unlockTimer = setTimeout(triggerVerification, 500);
        }
    }

    function triggerVerification() {
        if (unlockTriggered) return;
        unlockTriggered = true;
        console.log('Unlock Verification Triggered');

        canvas.style.pointerEvents = 'none'; // Lock input

        // Visual: "Scanning" effect
        var label = document.querySelector('.unlock-label');
        if (label) {
            gsap.to(label, {
                opacity: 0, duration: 0.3, onComplete: function () {
                    label.textContent = "Verificando trazo...";
                    label.style.color = "#dcb678";
                    gsap.to(label, { opacity: 1, duration: 0.3 });
                }
            });
        }

        // Pulse the Canvas Strokes (Simulated by CSS filter)
        canvas.style.transition = 'filter 1s ease';
        canvas.style.filter = 'brightness(2) drop-shadow(0 0 10px gold)';

        // Artificial "Analysis" Delay
        setTimeout(function () {
            if (label) {
                gsap.to(label, {
                    opacity: 0, duration: 0.3, onComplete: function () {
                        label.textContent = "Identidad Confirmada";
                        label.style.color = "#4ade80"; // Success Green
                        gsap.to(label, { opacity: 1, duration: 0.3 });
                    }
                });
            }

            // Success Flash
            canvas.style.filter = 'brightness(3) drop-shadow(0 0 20px #fff)';

            setTimeout(function () {
                if (typeof onUnlock === 'function') {
                    console.log('Calling onUnlock callback');
                    onUnlock();
                }
            }, 800);

        }, 1200); // Slightly faster analysis
    }

    function clearCanvas() {
        ctx.clearRect(0, 0, SIZE, SIZE);
        totalPixels = 0;
        strokeCount = 0;
        unlockTriggered = false;
        setupStyle();
    }

    // ── Unified Pointer Events (mouse + touch + pen) ─────────────
    canvas.addEventListener('pointerdown', startDraw);
    canvas.addEventListener('pointermove', draw);
    canvas.addEventListener('pointerup', endDraw);
    canvas.addEventListener('pointerleave', endDraw);
    canvas.addEventListener('pointercancel', endDraw);

    // ── Clear button ─────────────────────────────────────────────
    if (clearBtn) {
        clearBtn.addEventListener('click', clearCanvas);
    }
}


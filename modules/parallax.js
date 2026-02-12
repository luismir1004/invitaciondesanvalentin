/* ============================================================
   PARALLAX MODULE
   Depth effect using mouse movement / device orientation.
   ============================================================ */

import gsap from 'gsap';
import Core from './core.js';

/**
 * Initializes parallax depth on elements with [data-parallax-depth].
 * Uses mouse on desktop, gyroscope/accelerometer on mobile.
 */
export function initParallax() {
    var elements = document.querySelectorAll('[data-parallax-depth]');
    if (!elements.length) return;

    // Core handles viewport, we use normalized inputs so no need for local centerX/Y


    /**
     * Apply parallax transforms based on offset values.
     * @param {number} offsetX — Normalized offset (-1 to 1)
     * @param {number} offsetY — Normalized offset (-1 to 1)
     */
    function applyParallax(offsetX, offsetY) {
        elements.forEach(function (el) {
            // Skip elements that GSAP is already animating (memory cards)
            if (el.classList.contains('memory-card')) return;

            var depth = parseFloat(el.dataset.parallaxDepth) || 0;
            var moveX = offsetX * depth * 1000;
            var moveY = offsetY * depth * 1000;

            // Use gsap.set to compose with other GSAP transforms
            if (typeof gsap !== 'undefined') {
                gsap.set(el, { x: moveX, y: moveY });
            } else {
                el.style.transform =
                    'translate3d(' + moveX.toFixed(2) + 'px, ' + moveY.toFixed(2) + 'px, 0)';
            }
        });
    }

    // ── DESKTOP: Mouse Movement ────────────────────────────────
    if (window.matchMedia('(pointer: fine)').matches) {
        var currentX = 0;
        var currentY = 0;

        function smoothUpdate() {
            // Use shared Core input (normalized -1 to 1)
            var targetX = Core ? Core.input.normX : 0;
            var targetY = Core ? Core.input.normY : 0;

            currentX += (targetX - currentX) * 0.08;
            currentY += (targetY - currentY) * 0.08;

            applyParallax(currentX, currentY);
            requestAnimationFrame(smoothUpdate);
        }
        smoothUpdate();

    } else {
        // ── MOBILE: Device Orientation (Gyroscope) ─────────────────
        if ('DeviceOrientationEvent' in window) {
            var hasPermission = false;

            function startGyroscope() {
                window.addEventListener('deviceorientation', function (e) {
                    var gamma = (e.gamma || 0) / 45; // Left-right tilt: -1 to 1
                    var beta = ((e.beta || 0) - 45) / 45; // Front-back tilt
                    gamma = Math.max(-1, Math.min(1, gamma));
                    beta = Math.max(-1, Math.min(1, beta));
                    applyParallax(gamma, beta);
                });
            }

            // iOS 13+ requires permission
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                document.addEventListener('touchstart', function requestPerm() {
                    if (hasPermission) return;
                    DeviceOrientationEvent.requestPermission()
                        .then(function (response) {
                            if (response === 'granted') {
                                hasPermission = true;
                                startGyroscope();
                            }
                        })
                        .catch(function () { });
                    document.removeEventListener('touchstart', requestPerm);
                }, { once: true });
            } else {
                startGyroscope();
            }
        }
    }
}

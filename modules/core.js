/* ============================================================
   CORE MODULE — Central Event Controller
   Manages shared ResizeObserver and Pointer tracking to reduce
   event listener overhead across the application.
   ============================================================ */

/**
 * Core event and viewport management system.
 * Dispatches 'app:resize' events and tracks pointer state.
 */
const Core = {
    events: new EventTarget(),
    input: {
        x: 0,
        y: 0,
        normX: 0, // -1 to 1
        normY: 0, // -1 to 1
        isPointerDown: false
    },
    viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1
    }
};

// ── Shared Resize Observer ─────────────────────────────────
// Debounced resize handler to prevent thrashing
let resizeTimeout;

function onResize() {
    if (resizeTimeout) cancelAnimationFrame(resizeTimeout);
    resizeTimeout = requestAnimationFrame(function () {
        Core.viewport.width = window.innerWidth;
        Core.viewport.height = window.innerHeight;
        Core.viewport.dpr = window.devicePixelRatio || 1;

        // Dispatch custom event for modules to listen to
        Core.events.dispatchEvent(new CustomEvent('app:resize'));
    });
}

window.addEventListener('resize', onResize, { passive: true });

// ── Shared Pointer Tracking ────────────────────────────────
// Tracks mouse/touch position globally for parallax, effects, etc.
function onPointerMove(e) {
    let x, y;

    if (e.touches && e.touches.length) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
    } else {
        x = e.clientX;
        y = e.clientY;
    }

    const w = Core.viewport.width;
    const h = Core.viewport.height;

    Core.input.x = x;
    Core.input.y = y;

    // Normalized coordinates (-1 to 1) from center
    Core.input.normX = (x - w / 2) / (w / 2);
    Core.input.normY = (y - h / 2) / (h / 2);
}

function onPointerDown() { Core.input.isPointerDown = true; }
function onPointerUp() { Core.input.isPointerDown = false; }

// Use passive listeners for better scrolling performance
window.addEventListener('mousemove', onPointerMove, { passive: true });
window.addEventListener('touchmove', onPointerMove, { passive: true });
window.addEventListener('mousedown', onPointerDown, { passive: true });
window.addEventListener('mouseup', onPointerUp, { passive: true });
window.addEventListener('touchstart', onPointerDown, { passive: true });
window.addEventListener('touchend', onPointerUp, { passive: true });



export default Core;

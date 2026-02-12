/* ============================================================
   VISUALIZER MODULE — Audio Reactive Waveform
   Canvas-based bar visualizer simulating audio response.
   ============================================================ */

import Core from './core.js';

/**
 * Initializes a simulated audio visualizer using Canvas.
 * Creates animated bars that simulate reactive music waveform.
 */
export function initAudioVisualizer() {
    var canvas = document.getElementById('audio-visualizer');
    if (!canvas) return;

    var ctx = canvas.getContext('2d');
    var barCount = 32;
    var bars = [];
    var animId = null;

    var gradient = null;

    function createGradient() {
        if (!ctx) return;
        var h = 32 * (window.devicePixelRatio || 1);
        gradient = ctx.createLinearGradient(0, 0, 0, h);
        gradient.addColorStop(0, 'rgba(212, 165, 116, 0.8)');
        gradient.addColorStop(0.5, 'rgba(232, 99, 139, 0.6)');
        gradient.addColorStop(1, 'rgba(155, 126, 200, 0.4)');
    }

    function resize() {
        if (Core) {
            canvas.width = Core.viewport.width;
            // Visualizer width is container width, not full screen
            var rect = canvas.parentElement.getBoundingClientRect();
            var dpr = Core.viewport.dpr;
            canvas.width = rect.width * dpr;
            canvas.height = 32 * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = '32px';
            ctx.scale(dpr, dpr);
            createGradient();
        } else {
            var rect = canvas.parentElement.getBoundingClientRect();
            var dpr = window.devicePixelRatio || 1;
            canvas.width = rect.width * dpr;
            canvas.height = 32 * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = '32px';
            ctx.scale(dpr, dpr);
            createGradient();
        }
    }
    resize();

    if (Core && Core.events) {
        Core.events.addEventListener('app:resize', function () {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            resize();
        });
    } else {
        window.addEventListener('resize', function () {
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            resize();
        });
    }

    // Initialize bars with random phases
    for (var i = 0; i < barCount; i++) {
        bars.push({
            height: 0,
            targetHeight: 0,
            phase: Math.random() * Math.PI * 2,
            speed: 0.02 + Math.random() * 0.03,
            amplitude: 0.3 + Math.random() * 0.7
        });
    }

    var time = 0;

    function animate() {
        // Use cached gradient

        var canvasWidth = canvas.width / (window.devicePixelRatio || 1);
        var canvasHeight = 32;

        ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        var barWidth = canvasWidth / barCount;
        var gap = 1;

        time += 0.05;

        for (var i = 0; i < barCount; i++) {
            var bar = bars[i];

            // Simulate audio data with layered sine waves
            var wave1 = Math.sin(time * 2.5 + bar.phase) * 0.5 + 0.5;
            var wave2 = Math.sin(time * 1.8 + bar.phase * 1.3) * 0.3 + 0.5;
            var wave3 = Math.sin(time * 4.2 + i * 0.4) * 0.2 + 0.5;
            var beat = Math.pow(Math.sin(time * 1.5) * 0.5 + 0.5, 3) * 0.4;

            bar.targetHeight = (wave1 * wave2 + wave3 + beat) * bar.amplitude * canvasHeight * 0.8;
            bar.height += (bar.targetHeight - bar.height) * 0.15;

            var h = Math.max(2, bar.height);
            var x = i * barWidth + gap / 2;
            var y = canvasHeight - h;

            ctx.fillStyle = gradient || 'rgba(212, 165, 116, 0.8)'; // Fallback
            ctx.beginPath();
            if (ctx.roundRect) {
                ctx.roundRect(x, y, barWidth - gap, h, 1);
            } else {
                ctx.rect(x, y, barWidth - gap, h);
            }
            ctx.fill();
        }

        animId = requestAnimationFrame(animate);
    }

    animate();

    return {
        destroy: function () {
            if (animId) cancelAnimationFrame(animId);
        }
    };
}

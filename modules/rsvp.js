/* ============================================================
   ROYAL RSVP MODULE
   Handles the long-press interaction, confetti, and ticket reveal.
   ============================================================ */

import confetti from 'canvas-confetti';

export function initRoyalRSVP() {
    const btn = document.getElementById('royal-seal-btn');
    const progressCircle = document.querySelector('.progress-fill');
    const instruction = document.querySelector('.seal-instruction');
    const rsvpCard = document.getElementById('rsvp-card');
    const ticket = document.getElementById('golden-ticket');
    const ticketContainer = document.getElementById('rsvp-ticket-container');

    if (!btn) return;
    if (!progressCircle) return;

    let progress = 0;
    let isHolding = false;
    let animationFrame;
    const TOTAL_CIRCUMFERENCE = 283; // 2 * pi * 45
    const HOLD_DURATION = 1500; // 1.5s to confirm
    let startTime = 0;

    function updateProgress(timestamp) {
        if (!isHolding) {
            // Decay logic (Bounce back)
            if (progress > 0) {
                progress -= 5; // Fast decay
                if (progress < 0) progress = 0;
                setProgressVisuals(progress);
                animationFrame = requestAnimationFrame(updateProgress);
            }
            return;
        }

        const elapsed = timestamp - startTime;
        progress = Math.min((elapsed / HOLD_DURATION) * 100, 100);

        // Haptic feedback simulation (Vibrate on mobile)
        if (progress > 80 && window.navigator && window.navigator.vibrate) {
            if (Math.random() > 0.7) window.navigator.vibrate(5); // Random light rumble
        }

        setProgressVisuals(progress);

        if (progress >= 100) {
            triggerSuccess();
        } else {
            animationFrame = requestAnimationFrame(updateProgress);
        }
    }

    function setProgressVisuals(p) {
        const offset = TOTAL_CIRCUMFERENCE - (p / 100) * TOTAL_CIRCUMFERENCE;
        progressCircle.style.strokeDashoffset = offset;

        // Scale effect
        const scale = 1 + (p / 500); // Slight grow
        btn.style.transform = `scale(${scale})`;

        // Shake effect near end
        if (p > 80) {
            const shake = Math.random() * 4 - 2;
            btn.style.marginLeft = `${shake}px`;
        } else {
            btn.style.marginLeft = '0px';
        }
    }

    function startHold(e) {
        e.preventDefault(); // Prevent text selection/scroll
        if (progress >= 100) return; // Already done

        isHolding = true;
        startTime = performance.now();
        instruction.style.opacity = '0.5';
        instruction.innerText = "Sellando pacto...";
        animationFrame = requestAnimationFrame(updateProgress);
    }

    function endHold(e) {
        isHolding = false;
        instruction.style.opacity = '0.8';
        instruction.innerText = "Mantén presionado para sellar";
        // Cancel shake
        btn.style.marginLeft = '0px';
        btn.style.transform = 'scale(1)';
    }

    function triggerSuccess() {
        isHolding = false;
        cancelAnimationFrame(animationFrame);

        // 1. Audio & Haptics
        if (window.navigator && window.navigator.vibrate) window.navigator.vibrate([200, 100, 200]);

        // 2. Confetti Explosion (Center of button)
        const rect = btn.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        if (confetti) {
            confetti({
                particleCount: 150,
                spread: 100,
                origin: { x: x, y: y },
                colors: ['#D4AF37', '#ffffff', '#c4727f'],
                disableForReducedMotion: true
            });
        }

        // 3. UI Transition
        instruction.innerText = "¡Pacto Sellado! 🌹";
        instruction.style.color = "#D4AF37";
        instruction.style.opacity = "1";

        // Hide Question, Show Ticket
        setTimeout(() => {
            rsvpCard.style.opacity = '0';
            rsvpCard.style.transform = 'scale(0.9)';

            setTimeout(() => {
                rsvpCard.style.display = 'none'; // Remove from flow

                // CRITICAL FIX: Unhide the parent container with FORCE
                if (ticketContainer) {
                    ticketContainer.style.display = 'flex'; // Standard CSS toggle
                    ticketContainer.style.visibility = 'visible';
                    ticketContainer.style.opacity = '1';
                    ticketContainer.style.zIndex = '10005';
                    ticketContainer.classList.add('ticket-visible');
                }

                if (ticket) {
                    ticket.classList.remove('hidden');
                    ticket.style.opacity = '1';
                    ticket.style.marginTop = '0'; // Override any CSS ghost
                    ticket.style.transform = 'translateY(0) scale(1)'; // Force GSAP end state
                    // Force reflow
                    void ticket.offsetWidth;
                    ticket.classList.add('revealed');
                } else {
                    console.error("❌ Critical: Ticket Element ID 'golden-ticket' NOT FOUND during reveal!");
                }

                // Final Confetti Rain
                if (confetti) {
                    var duration = 3000;
                    var end = Date.now() + duration;
                    (function frame() {
                        confetti({
                            particleCount: 5,
                            angle: 60,
                            spread: 55,
                            origin: { x: 0 },
                            colors: ['#D4AF37']
                        });
                        confetti({
                            particleCount: 5,
                            angle: 120,
                            spread: 55,
                            origin: { x: 1 },
                            colors: ['#D4AF37']
                        });
                        if (Date.now() < end) requestAnimationFrame(frame);
                    }());
                }
            }, 500);
        }, 800);
    }

    // Attach Listeners
    btn.addEventListener('mousedown', startHold);
    btn.addEventListener('touchstart', startHold);

    window.addEventListener('mouseup', endHold);
    window.addEventListener('touchend', endHold);

    // Click Fallback (Instant Accept)
    btn.addEventListener('click', function (e) {
        if (!isHolding || progress < 100) {
            // If they clicked/tapped without holding long enough, JUST ACCEPT IT.
            progress = 100;
            setProgressVisuals(100);
            triggerSuccess();
        }
    });

    // ── Luxury Ticket Tilt Effect ──
    if (ticketContainer) {
        ticketContainer.addEventListener('mousemove', function (e) {
            const card = document.getElementById('golden-ticket');
            if (!card) return;

            const rect = ticketContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation (max 15deg)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Invert Y for tilt
            const rotateY = ((x - centerX) / centerX) * 10;

            // Apply transform
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1)`;

            // Update Hologram Angle
            const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
            card.style.setProperty('--rx', `${angle}deg`);
        });

        // Reset on leave
        ticketContainer.addEventListener('mouseleave', function () {
            const card = document.getElementById('golden-ticket');
            if (card) {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
            }
        });
    }
}


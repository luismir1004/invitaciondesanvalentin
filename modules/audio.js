/* ============================================================
   AUDIO MODULE — Real Audio Playback
   Song: Rawayana - Domingo Familiar
   ============================================================ */

var audio = null;
var isMuted = false;
var volume = 0.5;

function initAudioContext() {
    if (audio) return;

    // Create audio instance
    audio = new Audio('assets/audio/domingo_familiar.mp3');
    audio.loop = true;
    audio.volume = volume;
}

/**
 * Browsers block audio unless triggered by user interaction.
 * Call this immediately on the first click (e.g. envelope open).
 */
export function unlockAudio() {
    if (!audio) initAudioContext();

    // Resume context if suspended (Web Audio API specific, but good practice)
    // For HTML5 Audio, just playing is enough.

    const startPlay = () => {
        audio.play().then(() => {
            // It worked! We can pause now and wait for the real trigger.
            audio.pause();
            audio.currentTime = 0;
            // Remove global listeners once unlocked
            document.removeEventListener('touchstart', unlockAudio);
            document.removeEventListener('click', unlockAudio);
        }).catch(e => {
            console.log("Audio unlock failed (will try again on next interaction):", e);
        });
    };

    startPlay();
}

// Aggressively try to unlock on ANY first interaction
if (typeof window !== 'undefined') {
    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });
}

export function updateButtonVisual() {
    var btn = document.getElementById('audio-toggle');
    if (btn) {
        btn.classList.toggle('muted', isMuted);
        btn.innerHTML = isMuted ?
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M17.25 12h-2.25m-3.75 0h-2.25M4.501 12h-2.25m19.5 0h-2.25m-15 0h-2.25" stroke-linecap="round" stroke-linejoin="round"/></svg>' :
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }
}

export function playShimmerSound() {
    // Keep synthesized shimmer for interactions if desired
}

export function playAmbientMelody() {
    if (!audio) initAudioContext();

    // Try to play. If not muted, goes for it.
    if (!isMuted) {
        var promise = audio.play();
        if (promise !== undefined) {
            promise.then(_ => {
                // Autoplay started!
            }).catch(error => {
                console.log("Autoplay prevented. UI will sync to muted state.");
                // If blocked, treat as muted so user must click to play
                isMuted = true;
                updateButtonVisual();
            });
        }
    }
}

export function toggleAudioMute() {
    if (!audio) initAudioContext();

    isMuted = !isMuted;

    if (isMuted) {
        audio.pause();
    } else {
        audio.play().catch(e => console.error("Play error:", e));
    }

    updateButtonVisual();
}

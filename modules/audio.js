/* ============================================================
   AUDIO MODULE — Professional Web Audio Implementation
   Song: Rawayana - Domingo Familiar
   ============================================================ */

let audio = null; // HTML5 Audio Element for the track
let isMuted = false;
let volume = 0.5;
let audioContext = null; // Web Audio API Context for unlocking

function initAudioSystem() {
    if (audio) return;

    // 1. Core Track Setup
    audio = new Audio('assets/audio/domingo_familiar.mp3');
    audio.loop = true;
    audio.volume = volume;

    // 2. Web Audio Context (The Key to Mobile Autoplay)
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
        audioContext = new AudioContext();
    }
}

/**
 * THE "PRO" UNLOCKER
 * Uses Web Audio API to force the browser's audio engine to wake up.
 * This is far more reliable than just playing an HTML5 audio tag.
 */
export function unlockAudio() {
    if (!audio) initAudioSystem();

    // Strategy A: Resume Web Audio Context
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed successfully.");
        });
    }

    // Strategy B: Play a silent buffer (The "Empty Sound" Trick)
    // This forces the audio hardware to engage
    if (audioContext) {
        const buffer = audioContext.createBuffer(1, 1, 22050);
        const source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        if (source.start) source.start(0);
        else if (source.noteOn) source.noteOn(0);
    }

    // Strategy C: Prime the Main Track (Play then Pause)
    // We only do this if it's NOT already playing
    if (audio.paused) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                // Success! Immediately pause and reset so it waits for the cue.
                audio.pause();
                audio.currentTime = 0;

                // Cleanup: We are unlocked, remove listeners to save resources
                removeUnlockListeners();
            }).catch(error => {
                console.warn("Audio unlock prevented:", error);
                // Don't remove listeners; try again next tap
            });
        }
    }
}

function removeUnlockListeners() {
    if (typeof document !== 'undefined') {
        document.removeEventListener('touchstart', unlockAudio);
        document.removeEventListener('click', unlockAudio);
        document.removeEventListener('keydown', unlockAudio);
    }
}

// Attach aggressive listeners immediately
if (typeof window !== 'undefined') {
    const events = ['touchstart', 'click', 'keydown'];
    // Use passive: false to ensure we can intercept if needed, though usually not required for audio
    events.forEach(event => document.addEventListener(event, unlockAudio, { once: false, passive: false }));
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
    if (!audio) initAudioSystem();

    if (!isMuted) {
        // Force resume context just in case
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }

        audio.play().catch(e => {
            console.warn("Autoplay blocked, waiting for interaction:", e);
            isMuted = true;
            updateButtonVisual();
        });
    }
}

export function toggleAudioMute() {
    if (!audio) initAudioSystem();

    isMuted = !isMuted;

    if (isMuted) {
        audio.pause();
    } else {
        // If unmuting, ensure context is running
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
        audio.play().catch(e => console.error("Play error:", e));
    }

    updateButtonVisual();
}

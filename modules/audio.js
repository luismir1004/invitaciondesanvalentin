/* ============================================================
   AUDIO MODULE — Reproductor real (progreso, tiempo, play/pausa)
   Song: Domingo Familiar
   ============================================================ */

let audio = null;              // HTML5 Audio element
let audioContext = null;       // Web Audio context (mobile unlock)
let userPaused = false;        // true once the user deliberately pauses
let volume = 0.5;

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M8 5v14l11-7z"/></svg>';
const PAUSE_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><path d="M6 5h4v14H6zM14 5h4v14h-4z"/></svg>';

function initAudioSystem() {
    if (audio) return;
    audio = new Audio('./audio/domingo_familiar.mp3');
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'metadata';

    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) audioContext = new Ctx();
}

function fmt(seconds) {
    if (!Number.isFinite(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return m + ':' + String(s).padStart(2, '0');
}

function resumeContext() {
    if (audioContext && audioContext.state === 'suspended') {
        audioContext.resume().catch(() => {});
    }
}

/**
 * Refleja el estado real de reproducción en el botón.
 */
export function updateButtonVisual() {
    const btn = document.getElementById('audio-toggle');
    if (!btn) return;
    const playing = !!audio && !audio.paused;
    btn.classList.toggle('playing', playing);
    btn.setAttribute('aria-label', playing ? 'Pausar música' : 'Reproducir música');
    btn.innerHTML = playing ? PAUSE_ICON : PLAY_ICON;
}

/**
 * Enlaza la UI del reproductor (barra de progreso, tiempos, seek).
 */
export function initPlayerUI() {
    if (!audio) initAudioSystem();

    const fill = document.querySelector('.progress-fill');
    const track = document.querySelector('.progress-bar');
    const curEl = document.querySelector('.time-current');
    const totEl = document.querySelector('.time-total');

    const setTotal = () => { if (totEl) totEl.textContent = fmt(audio.duration); };

    audio.addEventListener('loadedmetadata', setTotal);
    if (audio.readyState >= 1) setTotal();

    audio.addEventListener('timeupdate', () => {
        if (fill && audio.duration) {
            fill.style.width = (audio.currentTime / audio.duration * 100) + '%';
        }
        if (curEl) curEl.textContent = fmt(audio.currentTime);
        if (track && audio.duration) {
            track.setAttribute('aria-valuenow', String(Math.round(audio.currentTime)));
            track.setAttribute('aria-valuetext', `${fmt(audio.currentTime)} de ${fmt(audio.duration)}`);
        }
    });

    audio.addEventListener('play', updateButtonVisual);
    audio.addEventListener('pause', updateButtonVisual);

    if (track) {
        // Slider accesible: operable con teclado (flechas ±5s, Home/End)
        track.setAttribute('role', 'slider');
        track.setAttribute('tabindex', '0');
        track.setAttribute('aria-valuemin', '0');
        track.setAttribute('aria-valuenow', '0');
        audio.addEventListener('loadedmetadata', () => {
            track.setAttribute('aria-valuemax', String(Math.round(audio.duration)));
        });

        track.addEventListener('click', (e) => {
            if (!audio.duration) return;
            const rect = track.getBoundingClientRect();
            const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
            audio.currentTime = ratio * audio.duration;
        });

        track.addEventListener('keydown', (e) => {
            if (!audio.duration) return;
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
                e.preventDefault();
                audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
                e.preventDefault();
                audio.currentTime = Math.max(0, audio.currentTime - 5);
            } else if (e.key === 'Home') {
                e.preventDefault();
                audio.currentTime = 0;
            } else if (e.key === 'End') {
                e.preventDefault();
                audio.currentTime = audio.duration;
            }
        });
    }

    updateButtonVisual();
}

/**
 * Reproduce la melodía en la primera interacción del usuario,
 * a menos que la haya pausado a propósito.
 */
export function playAmbientMelody() {
    if (!audio) initAudioSystem();
    if (userPaused) return;

    resumeContext();
    const promise = audio.play();
    if (promise !== undefined) {
        promise.then(updateButtonVisual).catch((e) => {
            console.warn('Autoplay bloqueado, esperando interacción:', e);
            updateButtonVisual();
        });
    }
}

/**
 * Play/pausa real, controlado por el usuario.
 */
export function togglePlay() {
    if (!audio) initAudioSystem();

    if (audio.paused) {
        userPaused = false;
        resumeContext();
        audio.play().catch((e) => console.warn('Play error:', e));
    } else {
        userPaused = true;
        audio.pause();
    }
    updateButtonVisual();
}

/**
 * Inicializa el botón de audio toggle.
 */
export function initAudioToggle() {
    const btn = document.getElementById('audio-toggle');
    if (btn) {
        btn.addEventListener('click', togglePlay);
        // Mantener exposición global para compatibilidad
        window.togglePlay = togglePlay;
    }
}

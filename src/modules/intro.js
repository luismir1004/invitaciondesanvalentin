/* ============================================================
   INTRO MODULE — Apertura animada (telón de bienvenida)
   ============================================================ */

import { playAmbientMelody } from './audio.js';

export function initIntro() {
    const intro = document.getElementById('intro');
    const openBtn = document.getElementById('intro-open');
    if (!intro || !openBtn) return;

    // Bloquea el scroll mientras el intro está visible
    document.body.style.overflow = 'hidden';

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const finish = () => {
        intro.hidden = true;
        document.body.style.overflow = '';
        const heading = /** @type {HTMLElement | null} */ (document.querySelector('.hero-title'));
        if (heading) {
            heading.setAttribute('tabindex', '-1');
            heading.focus({ preventScroll: true });
        }
    };

    const open = () => {
        // El gesto de apertura desbloquea/inicia la música
        playAmbientMelody();

        // Avisa al resto de la página (el hero arranca su animación aquí)
        document.dispatchEvent(new CustomEvent('intro:open'));

        if (reduceMotion) {
            finish();
            return;
        }

        intro.classList.add('is-open');
        // Espera a que el telón termine de abrirse (transición de 1s)
        setTimeout(finish, 1100);
    };

    openBtn.addEventListener('click', open);

    // Enfoca el botón de apertura
    openBtn.focus({ preventScroll: true });
}
